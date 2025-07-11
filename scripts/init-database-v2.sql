-- 既存テーブルに新機能用のカラムとテーブルを追加

-- AI配信アドバイステーブル
CREATE TABLE ai_advice (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    advice_text TEXT NOT NULL,
    advice_type VARCHAR(50) DEFAULT 'general',
    confidence_score DECIMAL(3,2) DEFAULT 0.8,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 自動ハイライトテーブル
CREATE TABLE stream_highlights (
    id SERIAL PRIMARY KEY,
    stream_result_id INTEGER REFERENCES stream_results(id) ON DELETE CASCADE,
    highlight_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    timestamp_start INTEGER, -- 秒単位
    timestamp_end INTEGER,   -- 秒単位
    ai_confidence DECIMAL(3,2) DEFAULT 0.8,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- コミュニティ投稿テーブル
CREATE TABLE community_posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    image_url TEXT,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- コミュニティコメントテーブル
CREATE TABLE community_comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES community_posts(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- コミュニティいいねテーブル
CREATE TABLE community_likes (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES community_posts(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_id, user_id)
);

-- リアルタイム通知テーブル
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- WebSocket接続管理テーブル（DynamoDBの代替）
CREATE TABLE websocket_connections (
    connection_id VARCHAR(255) PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    connected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_ping TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 高度な統計分析用ビュー
CREATE VIEW user_analytics AS
SELECT 
    u.id,
    u.name,
    u.email,
    u.plan_type,
    COUNT(sr.id) as total_streams,
    AVG(sr.hearts) as avg_hearts,
    AVG(sr.spoons) as avg_spoons,
    AVG(sr.total_listeners) as avg_listeners,
    MAX(sr.hearts) as max_hearts,
    MAX(sr.spoons) as max_spoons,
    MAX(sr.total_listeners) as max_listeners,
    MIN(sr.best_rank) as best_rank,
    SUM(sr.hearts) as total_hearts,
    SUM(sr.spoons) as total_spoons,
    -- 成長率計算
    (
        SELECT AVG(hearts) 
        FROM stream_results sr2 
        WHERE sr2.user_id = u.id 
        AND sr2.created_at >= NOW() - INTERVAL '7 days'
    ) - (
        SELECT AVG(hearts) 
        FROM stream_results sr3 
        WHERE sr3.user_id = u.id 
        AND sr3.created_at >= NOW() - INTERVAL '14 days'
        AND sr3.created_at < NOW() - INTERVAL '7 days'
    ) as hearts_growth_rate,
    -- 配信頻度
    COUNT(sr.id) / GREATEST(EXTRACT(days FROM (MAX(sr.created_at) - MIN(sr.created_at))), 1) as streams_per_day
FROM users u
LEFT JOIN stream_results sr ON u.id = sr.user_id
WHERE sr.created_at >= NOW() - INTERVAL '30 days'
GROUP BY u.id, u.name, u.email, u.plan_type;

-- 既存テーブルに新しいカラムを追加
ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_subscription_id VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS notification_settings JSONB DEFAULT '{"email": true, "push": true, "realtime": true}';
ALTER TABLE users ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}';

ALTER TABLE stream_results ADD COLUMN IF NOT EXISTS ai_analyzed BOOLEAN DEFAULT FALSE;
ALTER TABLE stream_results ADD COLUMN IF NOT EXISTS sentiment_score DECIMAL(3,2);
ALTER TABLE stream_results ADD COLUMN IF NOT EXISTS engagement_rate DECIMAL(5,2);

ALTER TABLE gallery_contents ADD COLUMN IF NOT EXISTS ai_tags TEXT[];
ALTER TABLE gallery_contents ADD COLUMN IF NOT EXISTS is_highlight BOOLEAN DEFAULT FALSE;

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_ai_advice_user_id ON ai_advice(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_advice_created_at ON ai_advice(created_at);
CREATE INDEX IF NOT EXISTS idx_stream_highlights_stream_id ON stream_highlights(stream_result_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON community_posts(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_websocket_connections_user_id ON websocket_connections(user_id);

-- 関数: 通知作成
CREATE OR REPLACE FUNCTION create_notification(
    p_user_id INTEGER,
    p_title VARCHAR(255),
    p_message TEXT,
    p_type VARCHAR(50),
    p_data JSONB DEFAULT NULL
) RETURNS INTEGER AS $$
DECLARE
    notification_id INTEGER;
BEGIN
    INSERT INTO notifications (user_id, title, message, notification_type, data)
    VALUES (p_user_id, p_title, p_message, p_type, p_data)
    RETURNING id INTO notification_id;
    
    RETURN notification_id;
END;
$$ LANGUAGE plpgsql;

-- 関数: エンゲージメント率計算
CREATE OR REPLACE FUNCTION calculate_engagement_rate(
    p_hearts INTEGER,
    p_spoons INTEGER,
    p_total_listeners INTEGER
) RETURNS DECIMAL(5,2) AS $$
BEGIN
    IF p_total_listeners = 0 THEN
        RETURN 0;
    END IF;
    
    RETURN ROUND(((p_hearts + p_spoons * 2.0) / p_total_listeners * 100), 2);
END;
$$ LANGUAGE plpgsql;

-- トリガー: エンゲージメント率自動計算
CREATE OR REPLACE FUNCTION update_engagement_rate()
RETURNS TRIGGER AS $$
BEGIN
    NEW.engagement_rate = calculate_engagement_rate(NEW.hearts, NEW.spoons, NEW.total_listeners);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_engagement_rate
    BEFORE INSERT OR UPDATE ON stream_results
    FOR EACH ROW
    EXECUTE FUNCTION update_engagement_rate();
