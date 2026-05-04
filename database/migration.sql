-- マイグレーション: travel_time_minutes を elevation_diff に変更
-- 実行日: 2026-05-04
-- 説明: 移動時間から標高差に変更

-- Step 1: カラム名を変更
ALTER TABLE mountains
RENAME COLUMN travel_time_minutes TO elevation_diff;

-- Step 2: 既存データを削除（移動時間のデータは標高差として使えないため）
TRUNCATE TABLE mountains;

-- Step 3: 標高差の初期データを投入
INSERT INTO mountains (name, elevation_diff) VALUES
    ('富士山', 1450),      -- 富士宮口5合目から山頂まで
    ('高尾山', 200),       -- 登山口から山頂まで
    ('筑波山', 610),       -- つつじヶ丘から山頂まで
    ('丹沢山', 1200),      -- 大倉から山頂まで
    ('御岳山', 400)        -- ケーブル下から山頂まで
ON CONFLICT (name) DO NOTHING;
