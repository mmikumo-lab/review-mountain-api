const pool = require('../config/database');

/**
 * 全ての山を取得
 * @returns {Promise<Array>} 山のリスト
 */
const getAllMountains = async () => {
  const result = await pool.query('SELECT * FROM mountains ORDER BY id');
  return result.rows;
};

/**
 * IDで山を取得
 * @param {number} id - 山のID
 * @returns {Promise<Object|undefined>} 山のデータ
 */
const getMountainById = async (id) => {
  const result = await pool.query('SELECT * FROM mountains WHERE id = $1', [id]);
  return result.rows[0];
};

/**
 * 名前で山を取得
 * @param {string} name - 山の名前
 * @returns {Promise<Object|undefined>} 山のデータ
 */
const getMountainByName = async (name) => {
  const result = await pool.query('SELECT * FROM mountains WHERE name = $1', [name]);
  return result.rows[0];
};

/**
 * 山を作成
 * @param {string} name - 山の名前
 * @param {number} elevation_diff - 標高差（メートル）
 * @param {string|null} total_time - 総歩行時間
 * @returns {Promise<Object>} 作成された山のデータ
 */
const createMountain = async (name, elevation_diff, total_time = null) => {
  const result = await pool.query(
    'INSERT INTO mountains (name, elevation_diff, total_time) VALUES ($1, $2, $3) RETURNING *',
    [name, elevation_diff, total_time]
  );
  return result.rows[0];
};

/**
 * 山を更新
 * @param {number} id - 山のID
 * @param {string} name - 山の名前
 * @param {number} elevation_diff - 標高差（メートル）
 * @returns {Promise<Object|undefined>} 更新された山のデータ
 */
const updateMountain = async (id, name, elevation_diff) => {
  const result = await pool.query(
    'UPDATE mountains SET name = $1, elevation_diff = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
    [name, elevation_diff, id]
  );
  return result.rows[0];
};

/**
 * 山を削除
 * @param {number} id - 山のID
 * @returns {Promise<Object|undefined>} 削除された山のデータ
 */
const deleteMountain = async (id) => {
  const result = await pool.query('DELETE FROM mountains WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

module.exports = {
  getAllMountains,
  getMountainById,
  getMountainByName,
  createMountain,
  updateMountain,
  deleteMountain,
};
