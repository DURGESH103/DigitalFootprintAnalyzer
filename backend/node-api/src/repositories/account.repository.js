const db = require('../config/db');

const upsert = async ({ userId, provider, username }) => {
  await db.query(
    `INSERT INTO connected_accounts (user_id, provider, username)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE username = VALUES(username), updated_at = NOW()`,
    [userId, provider, username]
  );
};

const findByUserId = async (userId) => {
  const [rows] = await db.query(
    'SELECT provider, username FROM connected_accounts WHERE user_id = ?',
    [userId]
  );
  return rows;
};

module.exports = { upsert, findByUserId };
