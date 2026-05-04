const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ルートのインポート
const mountainRoutes = require('./routes/mountain');

app.use(express.json());

// APIルート
app.use('/api', mountainRoutes);

app.get('/', (req, res) => {
  res.json({
    message: '山の標高差API',
    status: 'running',
    endpoints: {
      'POST /api/mountains': '山を作成',
      'GET /api/mountains/:id': '山を取得',
      'PUT /api/mountains/:id': '山を更新',
      'DELETE /api/mountains/:id': '山を削除'
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
