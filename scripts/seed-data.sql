-- サンプルユーザーデータ
INSERT INTO users (email, name, plan_type, status) VALUES
('tanaka@example.com', '田中太郎', 'free', 'active'),
('sato@example.com', '佐藤花子', 'premium', 'active'),
('yamada@example.com', '山田次郎', 'free', 'inactive'),
('admin@example.com', '管理者', 'admin', 'active');

-- サンプル配信リザルトデータ
INSERT INTO stream_results (user_id, title, stream_date, hearts, spoons, total_listeners, active_listeners, best_rank, end_rank) VALUES
(1, '雑談配信', '2025-01-08', 450, 23, 89, 67, 5, 8),
(1, '歌枠', '2025-01-07', 680, 45, 156, 123, 3, 4),
(1, '朝活配信', '2025-01-06', 320, 18, 67, 45, 12, 15),
(2, '夜配信', '2025-01-08', 890, 67, 234, 189, 2, 3),
(2, 'ゲーム配信', '2025-01-07', 1200, 89, 345, 267, 1, 2);

-- サンプルリスナーデータ
INSERT INTO listener_data (stream_result_id, listener_name, hearts_given, spoons_given, is_gallery_registered) VALUES
(1, 'リスナーA', 50, 3, true),
(1, 'リスナーB', 30, 2, false),
(1, 'リスナーC', 80, 5, true),
(2, 'リスナーD', 120, 8, true),
(2, 'リスナーE', 90, 6, false);

-- サンプルギャラリーコンテンツ
INSERT INTO gallery_contents (user_id, title, description, file_url, file_type, view_count) VALUES
(1, '雑談配信の思い出', '楽しい雑談配信のスクリーンショット', '/uploads/image1.jpg', 'image/jpeg', 45),
(1, '歌枠ハイライト', 'お気に入りの歌を歌った時の動画', '/uploads/video1.mp4', 'video/mp4', 123),
(2, '配信リザルト', '最高順位を取った時のリザルト画面', '/uploads/image2.jpg', 'image/jpeg', 67);

-- サンプルイベントデータ
INSERT INTO events (name, description, start_date, end_date, status, created_by) VALUES
('新年配信イベント', '新年を祝う特別配信イベント', '2025-01-01', '2025-01-07', 'active', 4),
('歌枠チャレンジ', '歌枠配信者向けのチャレンジイベント', '2024-12-20', '2024-12-31', 'completed', 4);

-- サンプルイベント参加者
INSERT INTO event_participants (event_id, user_id) VALUES
(1, 1),
(1, 2),
(2, 1),
(2, 2),
(2, 3);

-- サンプルバッジ目標値
INSERT INTO badge_goals (user_id, badge_name, target_value, current_value, achieved) VALUES
(1, '月間ハート1000個', 1000, 1450, true),
(1, '週間配信7回', 7, 5, false),
(2, '月間スプーン100個', 100, 156, true);

-- サンプル課金履歴
INSERT INTO billing_history (user_id, amount, payment_method, status, billing_date) VALUES
(2, 500, 'credit_card', 'completed', '2025-01-01'),
(2, 500, 'credit_card', 'completed', '2024-12-01');

-- サンプル問い合わせ
INSERT INTO inquiries (user_id, email, subject, message, status) VALUES
(1, 'tanaka@example.com', 'アップロード機能について', 'ギャラリーに画像をアップロードできません', 'open'),
(2, 'sato@example.com', '課金について', '有料プランの詳細を教えてください', 'resolved');
