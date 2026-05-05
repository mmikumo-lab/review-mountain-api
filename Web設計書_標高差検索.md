# Webアプリケーション設計書 - 山の標高差検索

## 1. 概要
山の標高差をAPIから取得し、画面に表示するシンプルなWebアプリケーションです。

## 2. 画面設計

### 2.1 トップページ (index.html)

#### レイアウト
```
┌─────────────────────────────────────┐
│    山の標高差検索                      │
├─────────────────────────────────────┤
│                                     │
│  ┌───────────────────────────┐     │
│  │ 名前  │ 標高差            │     │
│  ├──────┼──────────────────┤     │
│  │富士山│ 1450m            │     │
│  │高尾山│  200m            │     │
│  │筑波山│  610m            │     │
│  └───────────────────────────┘     │
│                                     │
└─────────────────────────────────────┘
```

#### 画面要素
- **タイトル**: 「山の標高差検索」（h1タグ）
- **テーブル**: 山の一覧を表示
  - 列1: 名前（name）
  - 列2: 標高差（elevation_diff）

## 3. 技術スタック

### 3.1 フロントエンド
- **HTML5**: 画面構造
- **CSS3**: スタイリング
- **JavaScript (Vanilla)**: API呼び出しとDOM操作

### 3.2 バックエンド
- 既存のREST API（`http://localhost:3000/api/mountains`）を使用

## 4. ディレクトリ構成

```
review_mountain/
├── public/                    # 【新規】静的ファイル
│   ├── index.html            # トップページ
│   ├── css/
│   │   └── style.css         # スタイルシート
│   └── js/
│       └── app.js            # JavaScriptロジック
├── src/
│   ├── app.js                # Expressアプリ（修正: 静的ファイル配信を追加）
│   └── ...                   # 既存のバックエンドファイル
└── ...
```

## 5. API仕様

### 5.1 使用するAPIエンドポイント

#### GET /api/mountains（全件取得）

**注意**: 現在のAPIには全件取得エンドポイントがないため、以下のいずれかの対応が必要です。

**オプション1: 新しいエンドポイントを追加（推奨）**
```
GET /api/mountains
```

レスポンス例:
```json
[
  {
    "id": 1,
    "name": "富士山",
    "elevation_diff": 1450
  },
  {
    "id": 2,
    "name": "高尾山",
    "elevation_diff": 200
  }
]
```

**オプション2: 既存のエンドポイントを修正**
```
GET /api/mountains?name={name}
```
- クエリパラメータ `name` が空の場合、全件返却

## 6. 画面仕様

### 6.1 index.html

#### 必須要素
- タイトル: `<h1>山の標高差検索</h1>`
- テーブル:
  ```html
  <table id="mountainTable">
    <thead>
      <tr>
        <th>名前</th>
        <th>標高差</th>
      </tr>
    </thead>
    <tbody id="mountainTableBody">
      <!-- JavaScriptで動的に生成 -->
    </tbody>
  </table>
  ```

### 6.2 JavaScript (app.js)

#### 処理フロー
1. ページ読み込み時に `DOMContentLoaded` イベントをリッスン
2. APIエンドポイント `GET /api/mountains` を呼び出し
3. 取得したJSONデータをパース
4. テーブルの `<tbody>` に行を動的に追加
5. エラー時はコンソールにエラーを表示

#### 主要関数
- `fetchMountains()`: API呼び出し
- `renderTable(data)`: テーブルに行を追加
- `handleError(error)`: エラーハンドリング

### 6.3 CSS (style.css)

#### デザイン要件
- レスポンシブデザイン（モバイル対応）
- シンプルで読みやすいフォント
- テーブルの枠線とヘッダーの背景色
- ホバー時の行ハイライト

#### スタイル例
```css
/* タイトル */
h1 {
  text-align: center;
  color: #333;
  margin: 20px 0;
}

/* テーブル */
table {
  width: 80%;
  margin: 0 auto;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: center;
}

th {
  background-color: #4CAF50;
  color: white;
}

tr:hover {
  background-color: #f5f5f5;
}
```

## 7. 実装手順

### Phase 1: バックエンド修正
1. `src/app.js` に静的ファイル配信の設定を追加
2. `GET /api/mountains` エンドポイントを追加（全件取得）
3. 動作確認

### Phase 2: フロントエンド実装
1. `public/index.html` 作成
2. `public/css/style.css` 作成
3. `public/js/app.js` 作成
4. API連携とテーブル表示の実装
5. 動作確認

### Phase 3: 統合テスト
1. サーバー起動
2. ブラウザで `http://localhost:3000` にアクセス
3. テーブルに山の一覧が表示されることを確認

## 8. サンプルコード

### 8.1 index.html（基本構造）
```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>山の標高差検索</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <h1>山の標高差検索</h1>

  <table id="mountainTable">
    <thead>
      <tr>
        <th>名前</th>
        <th>標高差</th>
      </tr>
    </thead>
    <tbody id="mountainTableBody">
      <!-- JavaScriptで動的に生成 -->
    </tbody>
  </table>

  <script src="/js/app.js"></script>
</body>
</html>
```

### 8.2 app.js（JavaScript）
```javascript
// ページ読み込み時に山の一覧を取得
document.addEventListener('DOMContentLoaded', () => {
  fetchMountains();
});

// API呼び出し
async function fetchMountains() {
  try {
    const response = await fetch('/api/mountains');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const mountains = await response.json();
    renderTable(mountains);
  } catch (error) {
    handleError(error);
  }
}

// テーブルに行を追加
function renderTable(mountains) {
  const tbody = document.getElementById('mountainTableBody');
  tbody.innerHTML = ''; // 既存の行をクリア

  mountains.forEach(mountain => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${mountain.name}</td>
      <td>${mountain.elevation_diff}m</td>
    `;

    tbody.appendChild(row);
  });
}

// エラーハンドリング
function handleError(error) {
  console.error('エラーが発生しました:', error);
  const tbody = document.getElementById('mountainTableBody');
  tbody.innerHTML = '<tr><td colspan="2">データの取得に失敗しました</td></tr>';
}
```

### 8.3 style.css
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  background-color: #f4f4f4;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #333;
  margin: 20px 0 40px 0;
  font-size: 2em;
}

table {
  width: 80%;
  max-width: 800px;
  margin: 0 auto;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

th, td {
  border: 1px solid #ddd;
  padding: 12px 15px;
  text-align: center;
}

th {
  background-color: #4CAF50;
  color: white;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

tr:hover {
  background-color: #f5f5f5;
  cursor: pointer;
}

td {
  color: #555;
}

/* レスポンシブデザイン */
@media screen and (max-width: 768px) {
  table {
    width: 95%;
  }

  h1 {
    font-size: 1.5em;
  }

  th, td {
    padding: 8px;
    font-size: 14px;
  }
}
```

### 8.4 src/app.js（静的ファイル配信の追加）
```javascript
const express = require('express');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3000;

// ルートのインポート
const mountainRoutes = require('./routes/mountain');

app.use(express.json());

// 【追加】静的ファイルの配信
app.use(express.static(path.join(__dirname, '../public')));

// APIルート
app.use('/api', mountainRoutes);

// ルートアクセス時はindex.htmlを返す
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
```

## 9. 必要な実装

### バックエンド修正（必須）

#### 9.1 全件取得エンドポイントの追加

**ファイル**: `src/controllers/mountainController.js`

新しい関数を追加:
```javascript
/**
 * GET /api/mountains - 全ての山を取得
 */
const getAllMountains = async (req, res) => {
  try {
    const mountains = await mountainModel.getAllMountains();
    res.json(mountains);
  } catch (error) {
    console.error('getAllMountains error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'サーバーエラーが発生しました',
    });
  }
};
```

module.exportsに追加:
```javascript
module.exports = {
  createMountain,
  getMountainById,
  getMountainByNameSearch,
  updateMountain,
  deleteMountain,
  getAllMountains, // 【追加】
};
```

**ファイル**: `src/routes/mountain.js`

ルートを追加:
```javascript
// 【注意】この行は他のGETルートより前に定義する必要があります
// GET /api/mountains - 全件取得（クエリパラメータなし）
router.get('/mountains', (req, res, next) => {
  // クエリパラメータ name がない場合は全件取得
  if (!req.query.name) {
    return mountainController.getAllMountains(req, res);
  }
  // name がある場合は名前検索
  next();
});

// GET /api/mountains?name={name} - 名前検索
router.get('/mountains', mountainController.getMountainByNameSearch);
```

## 10. テスト項目

### 10.1 バックエンドテスト
- [ ] `GET /api/mountains` で全件取得できる
- [ ] `GET /api/mountains?name=富士山` で名前検索できる
- [ ] `GET /api/mountains/:id` でID検索できる

### 10.2 フロントエンドテスト
- [ ] `http://localhost:3000` でindex.htmlが表示される
- [ ] タイトル「山の標高差検索」が表示される
- [ ] テーブルが正しく表示される
- [ ] テーブルヘッダーが「名前, 標高差」の順で表示される
- [ ] 山のデータが正しく表示される
- [ ] データ取得失敗時にエラーメッセージが表示される

### 10.3 統合テスト
- [ ] サーバー起動後、ブラウザでアクセス可能
- [ ] APIからデータを取得し、画面に表示される
- [ ] レスポンシブデザインが機能する（モバイル・デスクトップ）

## 11. 実装優先順位

### Phase 1: バックエンド拡張
1. `src/controllers/mountainController.js` に `getAllMountains` 関数を追加
2. `src/routes/mountain.js` に全件取得ルートを追加
3. `src/app.js` に静的ファイル配信設定を追加
4. APIテスト（curlまたはブラウザ）

### Phase 2: フロントエンド実装
1. `public/` ディレクトリ作成
2. `public/index.html` 作成
3. `public/css/style.css` 作成
4. `public/js/app.js` 作成
5. 動作確認

### Phase 3: テストとデバッグ
1. ブラウザで動作確認
2. DevToolsでネットワークとコンソールを確認
3. エラーハンドリングのテスト
4. レスポンシブデザインの確認

## 12. 補足事項

### 12.1 セキュリティ考慮事項
- XSS対策: ユーザー入力はエスケープ処理（現時点では該当なし）
- CORS設定: 必要に応じて設定

### 12.2 将来の拡張案
- 検索機能の追加（名前で絞り込み）
- ソート機能（標高差順、名前順）
- ページネーション（データ量が多い場合）
- 山の詳細ページ（クリックで詳細表示）
- 新規登録・編集・削除のUIを追加

### 12.3 注意事項
- 既存のAPIエンドポイントには影響を与えない設計
- 静的ファイルは `/public` ディレクトリに格納
- APIは `/api` プレフィックスで統一
