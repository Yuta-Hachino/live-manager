-- 新機能用のサンプルデータ

-- AI配信アドバイスサンプル
INSERT INTO ai_advice (user_id, advice_text, advice_type, confidence_score) VALUES
(1, 'リスナーとの会話をもっと増やすと、ハート数が20%向上する可能性があります。質問コーナーを設けることをお勧めします。', 'engagement', 0.85),
(1, '配信時間を19:00-21:00に固定すると、リスナー数が平均25%向上します。', 'timing', 0.92),
(2, 'バラード系の楽曲でより多くのスプーンを獲得できそうです。感情を込めた歌声が評価されています。', 'content', 0.78),
(2, '歌枠の頻度を週2回に増やすと、スプーン獲得数が40%増加する可能性があります。', 'frequency', 0.88);

-- 自動ハイライトサンプル
INSERT INTO stream_highlights (stream_result_id, highlight_type, title, description, timestamp_start, timestamp_end, ai_confidence) VALUES
(1, 'funny_moment', '面白い話', 'リスナーが大爆笑した瞬間', 1800, 2100, 0.95),
(1, 'interaction', '質問コーナー', 'リスナーとの活発な交流', 3600, 4200, 0.88),
(2, 'singing', '感動的な歌声', 'バラード曲で多くのスプーンを獲得', 900, 1500, 0.92),
(2, 'request', 'リクエスト対応', 'リスナーからのリクエストに応える', 2700, 3300, 0.85);

-- コミュニティ投稿サンプル
INSERT INTO community_posts (user_id, content, likes_count, comments_count) VALUES
(1, '今日の配信で新記録達成！みんなありがとう🎉 次回はもっと頑張ります！', 24, 8),
(2, '歌枠のコツを教えてください！特に感情の込め方について知りたいです。', 12, 15),
(1, '配信環境を改善しました。音質どうでしたか？', 18, 6),
(2, '新しい楽曲にチャレンジしてみました。リクエストもお待ちしています♪', 31, 12);

-- コミュニティコメントサンプル
INSERT INTO community_comments (post_id, user_id, content) VALUES
(1, 2, 'おめでとうございます！いつも楽しい配信をありがとう'),
(1, 1, 'ありがとうございます！これからも頑張ります'),
(2, 1, '感情を込めるには、歌詞の意味を深く理解することが大切ですよ'),
(2, 2, 'アドバイスありがとうございます！参考にします'),
(3, 2, '音質すごく良くなってました！'),
(4, 1, '新曲素敵でした！また聞きたいです');

-- コミュニティいいねサンプル
INSERT INTO community_likes (post_id, user_id) VALUES
(1, 2), (2, 1), (3, 2), (4, 1);

-- 通知サンプル
INSERT INTO notifications (user_id, title, message, notification_type, data) VALUES
(1, '新しいAI配信アドバイス', 'あなたの配信データを分析した新しいアドバイスが利用可能です', 'ai_advice', '{"advice_id": 1}'),
(1, 'コミュニティ投稿にいいね', 'あなたの投稿に新しいいいねがつきました', 'community', '{"post_id": 1}'),
(2, '配信イベント開始', '新年配信イベントが開始されました', 'event', '{"event_id": 1}'),
(2, 'プレミアムプラン更新', 'プレミアムプランが正常に更新されました', 'billing', '{"amount": 500}');

-- 既存データの更新（AI分析済みフラグなど）
UPDATE stream_results SET 
    ai_analyzed = TRUE,
    sentiment_score = 0.8,
    engagement_rate = calculate_engagement_rate(hearts, spoons, total_listeners)
WHERE id IN (1, 2, 3, 4, 5);

-- ギャラリーコンテンツにAIタグを追加
UPDATE gallery_contents SET 
    ai_tags = ARRAY['配信', '思い出', '楽しい'],
    is_highlight = TRUE
WHERE id = 1;

UPDATE gallery_contents SET 
    ai_tags = ARRAY['歌', '音楽', '感動'],
    is_highlight = TRUE
WHERE id = 2;

UPDATE gallery_contents SET 
    ai_tags = ARRAY['リザルト', '成果', '記録'],
    is_highlight = FALSE
WHERE id = 3;
