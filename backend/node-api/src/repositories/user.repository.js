const db = require('../config/db');

const findByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0] || null;
};

const findById = async (id) => {
  const [rows] = await db.query(
    'SELECT id, name, email, created_at FROM users WHERE id = ?',
    [id]
  );
  return rows[0] || null;
};

const create = async ({ name, email, password }) => {
  const [result] = await db.query(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, password]
  );
  return { id: result.insertId, name, email };
};

const saveRefreshToken = async ({ userId, token }) => {
  await db.query(
    'INSERT INTO refresh_tokens (user_id, token) VALUES (?, ?)',
    [userId, token]
  );
};

const findRefreshToken = async (token) => {
  const [rows] = await db.query(
    'SELECT id FROM refresh_tokens WHERE token = ?',
    [token]
  );
  return rows[0] || null;
};

const deleteRefreshToken = async (token) => {
  await db.query('DELETE FROM refresh_tokens WHERE token = ?', [token]);
};

const deleteAllRefreshTokens = async (userId) => {
  await db.query('DELETE FROM refresh_tokens WHERE user_id = ?', [userId]);
};

module.exports = {
  findByEmail,
  findById,
  create,
  saveRefreshToken,
  findRefreshToken,
  deleteRefreshToken,
  deleteAllRefreshTokens,
};
