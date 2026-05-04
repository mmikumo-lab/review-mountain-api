const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// TODO: ルートを追加予定
// app.use('/api', mountainRoutes);

app.get('/', (req, res) => {
  res.json({
    message: '山の標高差API - プロジェクトセットアップ完了',
    status: 'setup'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
