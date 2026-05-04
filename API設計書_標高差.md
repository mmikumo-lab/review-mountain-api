# 山の標高差API 詳細設計書

## 1. 概要
登山口から山頂までの標高差を検索するREST APIです。データがない場合は http://www.yamaquest.com/ からスクレイピングして取得・保存します。

## 2. データベース設計

### 2.1 テーブル定義

#### mountainsテーブル
| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| id | SERIAL | PRIMARY KEY | 山ID（自動採番） |
| name | VARCHAR(100) | NOT NULL, UNIQUE | 山の名前 |
| elevation_diff | INTEGER | NOT NULL | 登山口から山頂までの標高差（m） |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 更新日時 |

### 2.2 テーブル作成SQL
```sql
CREATE TABLE mountains (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    elevation_diff INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- インデックス作成（検索性能向上のため）
CREATE INDEX idx_mountains_name ON mountains(name);
```

### 2.3 初期データ例
```sql
INSERT INTO mountains (name, elevation_diff) VALUES
    ('富士山', 1450),      -- 富士宮口5合目から山頂まで
    ('高尾山', 200),       -- 登山口から山頂まで
    ('筑波山', 610),       -- つつじヶ丘から山頂まで
    ('丹沢山', 1200),      -- 大倉から山頂まで
    ('御岳山', 400);       -- ケーブル下から山頂まで
```

## 3. API仕様

### 3.1 POST /api/mountains - 山の新規登録

#### 概要
新しい山のデータを手動で登録します。

#### リクエスト例
```bash
curl -X POST http://localhost:3000/api/mountains \
  -H "Content-Type: application/json" \
  -d '{"name": "富士山", "elevation_diff": 1450}'
```

#### リクエストヘッダー
```
Content-Type: application/json
```

#### リクエストボディ
```json
{
  "name": "富士山",
  "elevation_diff": 1450
}
```

| フィールド | 型 | 必須 | 説明 | バリデーション |
|-----------|-----|------|------|--------------|
| name | string | ○ | 山の名前 | 1文字以上100文字以内 |
| elevation_diff | integer | ○ | 登山口からの標高差（m） | 1以上の整数 |

#### レスポンス (201 Created)
```json
{
  "id": 1,
  "name": "富士山",
  "elevation_diff": 1450,
  "created_at": "2026-05-04T06:00:00.000Z"
}
```

| フィールド | 型 | 説明 |
|-----------|-----|------|
| id | integer | 山ID（自動採番） |
| name | string | 山の名前 |
| elevation_diff | integer | 登山口からの標高差（m） |
| created_at | string | 作成日時（ISO 8601形式） |

#### エラーレスポンス

##### 400 Bad Request
必須フィールドが欠けている場合：
```json
{
  "error": "Bad Request",
  "message": "山の名前と標高差は必須です"
}
```

標高差が不正な値の場合：
```json
{
  "error": "Bad Request",
  "message": "標高差は1以上の整数で入力してください"
}
```

##### 409 Conflict
同じ名前の山が既に存在する場合：
```json
{
  "error": "Conflict",
  "message": "この山は既に登録されています"
}
```

##### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "サーバーエラーが発生しました"
}
```

---

### 3.2 GET /api/mountains?name={mountainName} - 山の標高差取得（スクレイピング対応）

#### 概要
山の名前で標高差を検索します。DBにデータがない場合は、yamaquest.comからスクレイピングして取得・保存します。

#### リクエスト例
```bash
curl -X GET "http://localhost:3000/api/mountains?name=富士山"
```

#### クエリパラメータ
| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| name | string | ○ | 検索する山の名前 |

#### 処理フロー
1. クエリパラメータから山の名前を取得
2. DBで山の名前を検索
3. **DBにデータがある場合**: レスポンスを返却
4. **DBにデータがない場合**:
   - http://www.yamaquest.com/ にアクセス
   - 山の名前で検索
   - 登山口からの標高差を取得
   - DBに保存
   - レスポンスを返却
5. **スクレイピングでも見つからない場合**: 404エラー

#### レスポンス (200 OK)
```json
{
  "id": 1,
  "name": "富士山",
  "elevation_diff": 1450
}
```

| フィールド | 型 | 説明 |
|-----------|-----|------|
| id | integer | 山ID |
| name | string | 山の名前 |
| elevation_diff | integer | 登山口からの標高差（m） |

#### エラーレスポンス

##### 400 Bad Request
山の名前が指定されていない場合：
```json
{
  "error": "Bad Request",
  "message": "山の名前を指定してください"
}
```

##### 404 Not Found
山が見つからない（DBにもスクレイピングでも取得できない）：
```json
{
  "error": "Mountain not found",
  "message": "指定された山が見つかりません"
}
```

##### 500 Internal Server Error
サーバーエラー、スクレイピングエラー：
```json
{
  "error": "Internal Server Error",
  "message": "サーバーエラーが発生しました"
}
```

---

### 3.3 PUT /api/mountains/:id - 山の情報更新

#### 概要
指定したIDの山の情報を更新します。

#### リクエスト例
```bash
curl -X PUT http://localhost:3000/api/mountains/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "富士山（吉田ルート）", "elevation_diff": 1400}'
```

#### パスパラメータ
| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| id | integer | ○ | 更新する山のID |

#### リクエストヘッダー
```
Content-Type: application/json
```

#### リクエストボディ
```json
{
  "name": "富士山（吉田ルート）",
  "elevation_diff": 1400
}
```

| フィールド | 型 | 必須 | 説明 | バリデーション |
|-----------|-----|------|------|--------------|
| name | string | - | 山の名前 | 1文字以上100文字以内 |
| elevation_diff | integer | - | 登山口からの標高差（m） | 1以上の整数 |

**注意**: 少なくとも1つのフィールドは必須

#### レスポンス (200 OK)
```json
{
  "id": 1,
  "name": "富士山（吉田ルート）",
  "elevation_diff": 1400,
  "updated_at": "2026-05-04T07:00:00.000Z"
}
```

| フィールド | 型 | 説明 |
|-----------|-----|------|
| id | integer | 山ID |
| name | string | 更新後の山の名前 |
| elevation_diff | integer | 更新後の標高差（m） |
| updated_at | string | 更新日時（ISO 8601形式） |

#### エラーレスポンス

##### 400 Bad Request
更新するフィールドが指定されていない場合：
```json
{
  "error": "Bad Request",
  "message": "更新する内容を指定してください"
}
```

標高差が不正な値の場合：
```json
{
  "error": "Bad Request",
  "message": "標高差は1以上の整数で入力してください"
}
```

名前が空または空白のみの場合：
```json
{
  "error": "Bad Request",
  "message": "山の名前を入力してください"
}
```

##### 404 Not Found
指定されたIDの山が見つからない：
```json
{
  "error": "Mountain not found",
  "message": "指定された山が見つかりません"
}
```

##### 409 Conflict
他の山と同じ名前に変更しようとした場合：
```json
{
  "error": "Conflict",
  "message": "この山は既に登録されています"
}
```

##### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "サーバーエラーが発生しました"
}
```

---

### 3.4 DELETE /api/mountains/:id - 山の削除

#### 概要
指定したIDの山を削除します。

#### リクエスト例
```bash
curl -X DELETE http://localhost:3000/api/mountains/1
```

#### パスパラメータ
| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| id | integer | ○ | 削除する山のID |

#### リクエストヘッダー
不要

#### リクエストボディ
不要

#### レスポンス (200 OK)
```json
{
  "message": "山を削除しました",
  "id": 1,
  "name": "富士山"
}
```

| フィールド | 型 | 説明 |
|-----------|-----|------|
| message | string | 削除完了メッセージ |
| id | integer | 削除した山のID |
| name | string | 削除した山の名前 |

#### エラーレスポンス

##### 404 Not Found
指定されたIDの山が見つからない：
```json
{
  "error": "Mountain not found",
  "message": "指定された山が見つかりません"
}
```

##### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "サーバーエラーが発生しました"
}
```

---

## 4. プロジェクト構成

```
mountain-api/
├── src/
│   ├── config/
│   │   └── database.js           # DB接続設定（既存）
│   ├── services/
│   │   └── scraperService.js     # 【新規】スクレイピング処理
│   ├── routes/
│   │   └── mountain.js           # 【修正】ルート定義
│   ├── controllers/
│   │   └── mountainController.js # 【修正】ビジネスロジック
│   ├── models/
│   │   └── mountainModel.js      # 【修正】DBアクセス層
│   ├── utils/
│   │   └── validator.js          # 【新規】入力値バリデーション
│   └── app.js                    # Expressアプリ設定（既存）
├── database/
│   ├── init.sql                  # 【修正】データベース初期化スクリプト
│   └── migration.sql             # 【新規】マイグレーションスクリプト
├── .env                          # 環境変数（既存）
├── .env.example                  # 環境変数テンプレート（既存）
├── package.json                  # 【修正】依存関係にaxios, cheerioを追加
├── README.md                     # プロジェクト説明（既存）
└── API設計書_標高差.md            # 【新規】この設計書
```

## 5. 必要な依存パッケージ

### 追加が必要なパッケージ
```bash
npm install axios cheerio
```

### package.json
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.3",
    "dotenv": "^16.3.1",
    "axios": "^1.6.0",
    "cheerio": "^1.0.0-rc.12"
  }
}
```

- **axios**: HTTP通信（スクレイピング用）
- **cheerio**: HTMLパース（スクレイピング用）

## 6. スクレイピング仕様

### 6.1 対象サイト
- **URL**: http://www.yamaquest.com/
- **取得データ**: 山の名前と登山口からの標高差

### 6.2 スクレイピング処理フロー
1. axios で http://www.yamaquest.com/ にアクセス
2. 山の名前で検索（検索APIまたはHTMLパース）
3. 登山口からの標高差を抽出
4. データを返却

### 6.3 エラーハンドリング
- **タイムアウト**: 10秒でタイムアウト
- **ネットワークエラー**: 500エラーを返す
- **データが見つからない**: 404エラーを返す
- **パースエラー**: 500エラーを返す

### 6.4 設定
```javascript
// scraperService.js
const SCRAPER_CONFIG = {
  timeout: 10000,          // 10秒
  userAgent: 'Mozilla/5.0', // User-Agent
  retryCount: 3,           // リトライ回数
  retryDelay: 1000         // リトライ間隔（ms）
};
```

## 7. ファイル別実装内容

### 7.1 新規作成ファイル

#### src/services/scraperService.js
- `scrapeElevationDiff(mountainName)`: yamaquest.comから標高差をスクレイピング
- エラーハンドリング、リトライ処理

#### src/utils/validator.js
- `validateMountainName(name)`: 山の名前のバリデーション
- `validateElevationDiff(elevation)`: 標高差のバリデーション

#### database/migration.sql
- 既存の`travel_time_minutes`を`elevation_diff`に変更するマイグレーション

### 7.2 修正が必要なファイル

#### src/models/mountainModel.js
- `travel_time_minutes` → `elevation_diff` に変更
- メソッド名の変更（必要に応じて）

#### src/controllers/mountainController.js
- GETメソッドにスクレイピング処理を統合
- `scraperService.js`を呼び出し

#### src/routes/mountain.js
- GETエンドポイントを追加: `GET /api/mountains`

#### database/init.sql
- テーブル定義を`elevation_diff`に変更

#### package.json
- axios, cheerio を dependencies に追加

## 8. セキュリティ・パフォーマンス考慮事項

### 8.1 スクレイピング
- **レート制限**: 同じ山への連続リクエストを防ぐ（キャッシュ機能）
- **タイムアウト設定**: 10秒でタイムアウト
- **User-Agent設定**: 適切なUser-Agentヘッダーを付与
- **エラーリトライ**: 失敗時は最大3回リトライ
- **robots.txt遵守**: スクレイピング前にrobots.txtを確認

### 8.2 データベース
- **SQLインジェクション対策**: プリペアドステートメント使用
- **入力値バリデーション**: 山の名前、標高差の検証
- **UNIQUE制約**: 重複データ防止

### 8.3 API
- **レート制限**: 必要に応じてAPIレート制限を実装
- **CORS設定**: 必要に応じてCORS設定

## 9. 実装優先順位

### Phase 1: データベース変更とマイグレーション
1. `database/migration.sql` 作成
2. マイグレーション実行
3. `database/init.sql` 更新

### Phase 2: 基本CRUD実装（スクレイピングなし）
1. `src/utils/validator.js` 作成
2. `src/models/mountainModel.js` 修正
3. `src/controllers/mountainController.js` 修正
4. `src/routes/mountain.js` 修正
5. POST, GET (DBのみ), PUT, DELETE APIのテスト

### Phase 3: スクレイピング機能追加
1. `axios`, `cheerio` インストール
2. `src/services/scraperService.js` 作成
3. GETエンドポイントにスクレイピング処理を統合
4. エラーハンドリング、リトライ処理の実装
5. 統合テスト

## 10. API使用例まとめ

### 10.1 山登録
```bash
curl -X POST http://localhost:3000/api/mountains \
  -H "Content-Type: application/json" \
  -d '{"name": "富士山", "elevation_diff": 1450}'
```

レスポンス（201 Created）：
```json
{
  "id": 1,
  "name": "富士山",
  "elevation_diff": 1450,
  "created_at": "2026-05-04T06:00:00.000Z"
}
```

### 10.2 山検索（スクレイピング対応）
```bash
curl -X GET "http://localhost:3000/api/mountains?name=富士山"
```

レスポンス（200 OK）：
```json
{
  "id": 1,
  "name": "富士山",
  "elevation_diff": 1450
}
```

### 10.3 山更新
```bash
curl -X PUT http://localhost:3000/api/mountains/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "富士山（吉田ルート）", "elevation_diff": 1400}'
```

レスポンス（200 OK）：
```json
{
  "id": 1,
  "name": "富士山（吉田ルート）",
  "elevation_diff": 1400,
  "updated_at": "2026-05-04T07:00:00.000Z"
}
```

### 10.4 山削除
```bash
curl -X DELETE http://localhost:3000/api/mountains/1
```

レスポンス（200 OK）：
```json
{
  "message": "山を削除しました",
  "id": 1,
  "name": "富士山"
}
```
