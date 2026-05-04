const express = require('express');
require('dotenv').config();

const mountainRoutes = require('./routes/mountain');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api', mountainRoutes);

app.get('/', (req, res) => {
  res.json({
    message: '山の標高差API',
    version: '1.0.0',
    endpoints: {
      'POST /api/mountains': '山の新規登録',
      'GET /api/mountains?name={name}': '山の標高差取得',
      'PUT /api/mountains/:id': '山の情報更新',
      'DELETE /api/mountains/:id': '山の削除'
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
