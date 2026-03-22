const db = require('../config/db');

const create = async ({ userId, type, title, body = null }) => {
  const [result] = await db.query(
    'INSERT INTO notifications (user_id, type, title, body) VALUES (?, ?, ?, ?)',
    [userId, type, title, body]
  );
  return result.insertId;
};

const findByUserId = async (userId, { limit = 20 } = {}) => {
  const [rows] = await db.query(
    'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT ?',
    [userId, limit]
  );
  return rows;
};

const markAllRead = async (userId) => {
  await db.query('UPDATE notifications SET is_read = 1 WHERE user_id = ?', [userId]);
};

const getUnreadCount = async (userId) => {
  const [[{ count }]] = await db.query(
    'SELECT COUNT(*) AS count FROM notifications WHERE user_id = ? AND is_read = 0',
    [userId]
  );
  return count;
};

module.exports = { create, findByUserId, markAllRead, getUnreadCount };
