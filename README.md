# 山の標高差API

登山口から山頂までの標高差を検索するREST APIです。

## 技術スタック

- **Node.js** + **Express**: RESTful API
- **PostgreSQL**: データベース
- **dotenv**: 環境変数管理

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.example`をコピーして`.env`ファイルを作成し、PostgreSQLの接続情報を設定してください。

```bash
cp .env.example .env
```

`.env`ファイルを編集：

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mountain_elevation_db
DB_USER=your_username
DB_PASSWORD=your_password
PORT=3000
```

### 3. データベースの作成と初期化

PostgreSQLにログインして、データベースを作成します。

```bash
psql -U postgres
```

データベース作成：

```sql
CREATE DATABASE mountain_elevation_db;
\c mountain_elevation_db
```

テーブルとデータを初期化：

```bash
psql -U your_username -d mountain_elevation_db -f database/init.sql
```

### 4. サーバーの起動

開発モード（自動再起動あり）：

```bash
npm run dev
```

本番モード：

```bash
npm start
```

サーバーは `http://localhost:3000` で起動します。

## API仕様

詳細は `API設計書_標高差.md` を参照してください。

### エンドポイント一覧

- `POST /api/mountains` - 山の新規登録
- `GET /api/mountains?name={name}` - 山の標高差取得（スクレイピング対応）
- `GET /api/mountains/:id` - 山をIDで取得
- `PUT /api/mountains/:id` - 山の情報更新
- `DELETE /api/mountains/:id` - 山の削除

## ディレクトリ構成

```
review_mountain/
├── src/
│   ├── config/
│   │   └── database.js       # DB接続設定
│   ├── routes/
│   │   └── mountain.js       # ルート定義
│   ├── controllers/
│   │   └── mountainController.js  # ビジネスロジック
│   ├── models/
│   │   └── mountainModel.js  # DBアクセス層
│   ├── services/
│   │   └── scraperService.js # Webスクレイピング
│   ├── utils/
│   │   └── validator.js      # バリデーション
│   └── app.js                # Expressアプリ設定
├── database/
│   ├── init.sql              # データベース初期化スクリプト
│   └── migration.sql         # マイグレーションスクリプト
├── .env.example              # 環境変数テンプレート
├── .gitignore
├── package.json
├── API設計書_標高差.md        # API詳細設計書
└── README.md
```

## 開発ワークフロー

1. Issue作成
2. feature ブランチ作成（例: `feature/issue-1-xxx`）
3. 実装
4. PR作成 → develop
5. レビュー・マージ
6. develop → main

## ライセンス

ISC
