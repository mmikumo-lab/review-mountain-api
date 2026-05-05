const express = require('express');
const path = require('path');

// 明示的に .env ファイルのパスを指定
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3000;

// ルートのインポート
const mountainRoutes = require('./routes/mountain');

app.use(express.json());

// 静的ファイルの配信
app.use(express.static(path.join(__dirname, '../public')));

// APIルート
app.use('/api', mountainRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
