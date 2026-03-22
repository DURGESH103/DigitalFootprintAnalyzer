const db = require('../config/db');

const save = async ({ userId, reportId = null, role, content }) => {
  const [result] = await db.query(
    'INSERT INTO chat_messages (user_id, report_id, role, content) VALUES (?, ?, ?, ?)',
    [userId, reportId, role, content]
  );
  return result.insertId;
};

const getHistory = async (userId, reportId = null, limit = 20) => {
  const [rows] = await db.query(
    `SELECT role, content, created_at FROM chat_messages
     WHERE user_id = ? AND (report_id = ? OR (? IS NULL AND report_id IS NULL))
     ORDER BY created_at ASC LIMIT ?`,
    [userId, reportId, reportId, limit]
  );
  return rows;
};

const clearHistory = async (userId, reportId = null) => {
  await db.query(
    'DELETE FROM chat_messages WHERE user_id = ? AND report_id = ?',
    [userId, reportId]
  );
};

module.exports = { save, getHistory, clearHistory };
