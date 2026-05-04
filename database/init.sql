-- 山の標高差データベース初期化スクリプト

-- テーブルが存在する場合は削除
DROP TABLE IF EXISTS mountains;

-- mountainsテーブル作成
CREATE TABLE mountains (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  elevation_diff INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 初期データ投入
INSERT INTO mountains (name, elevation_diff) VALUES
  ('富士山', 1450),
  ('高尾山', 200),
  ('筑波山', 610),
  ('丹沢山', 1200),
  ('御岳山', 400);

-- 確認用
SELECT * FROM mountains;
