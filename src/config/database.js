const { Pool } = require('pg');
const path = require('path');

// 明示的に .env ファイルのパスを指定
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

console.log('Database configuration:', {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
});

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

module.exports = pool;
