-- 山テーブルの作成
CREATE TABLE IF NOT EXISTS mountains (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    elevation_diff INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 検索性能向上のためのインデックス作成
CREATE INDEX IF NOT EXISTS idx_mountains_name ON mountains(name);

-- 初期データの投入（登山口から山頂までの標高差）
INSERT INTO mountains (name, elevation_diff) VALUES
    ('富士山', 1450),      -- 富士宮口5合目から山頂まで
    ('高尾山', 200),       -- 登山口から山頂まで
    ('筑波山', 610),       -- つつじヶ丘から山頂まで
    ('丹沢山', 1200),      -- 大倉から山頂まで
    ('御岳山', 400)        -- ケーブル下から山頂まで
ON CONFLICT (name) DO NOTHING;
