const pool = require('../config/database');

class MountainModel {
  static async findByName(name) {
    const query = 'SELECT id, name, elevation_diff FROM mountains WHERE name = $1';
    const values = [name];

    try {
      const result = await pool.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async create(name, elevation_diff) {
    const query = `
      INSERT INTO mountains (name, elevation_diff)
      VALUES ($1, $2)
      RETURNING id, name, elevation_diff, created_at
    `;
    const values = [name, elevation_diff];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      if (error.code === '23505') {
        const duplicateError = new Error('Duplicate mountain name');
        duplicateError.code = 'DUPLICATE';
        throw duplicateError;
      }
      throw error;
    }
  }

  static async update(id, updates) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (updates.name !== undefined) {
      fields.push(`name = $${paramCount}`);
      values.push(updates.name);
      paramCount++;
    }

    if (updates.elevation_diff !== undefined) {
      fields.push(`elevation_diff = $${paramCount}`);
      values.push(updates.elevation_diff);
      paramCount++;
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE mountains
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, name, elevation_diff, updated_at
    `;

    try {
      const result = await pool.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      if (error.code === '23505') {
        const duplicateError = new Error('Duplicate mountain name');
        duplicateError.code = 'DUPLICATE';
        throw duplicateError;
      }
      throw error;
    }
  }

  static async delete(id) {
    const query = 'DELETE FROM mountains WHERE id = $1 RETURNING id, name';
    const values = [id];

    try {
      const result = await pool.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = MountainModel;
