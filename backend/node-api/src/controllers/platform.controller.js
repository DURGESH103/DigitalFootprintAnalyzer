const db = require('../config/db');

const getConnected = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      'SELECT provider, username, display_name, avatar_url, profile_url, is_verified, created_at FROM connected_accounts WHERE user_id = ?',
      [req.user.id]
    );
    res.json(rows);
  } catch (err) { next(err); }
};

const connect = async (req, res, next) => {
  try {
    const { provider, username, displayName, avatarUrl, profileUrl } = req.body;
    await db.query(
      `INSERT INTO connected_accounts (user_id, provider, username, display_name, avatar_url, profile_url)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE username = VALUES(username), display_name = VALUES(display_name),
         avatar_url = VALUES(avatar_url), profile_url = VALUES(profile_url), updated_at = NOW()`,
      [req.user.id, provider, username, displayName || null, avatarUrl || null, profileUrl || null]
    );
    res.json({ message: `${provider} account connected` });
  } catch (err) { next(err); }
};

const disconnect = async (req, res, next) => {
  try {
    const { provider } = req.params;
    await db.query(
      'DELETE FROM connected_accounts WHERE user_id = ? AND provider = ?',
      [req.user.id, provider]
    );
    res.json({ message: `${provider} account disconnected` });
  } catch (err) { next(err); }
};

module.exports = { getConnected, connect, disconnect };
