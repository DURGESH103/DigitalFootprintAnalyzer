const db = require('../config/db');

const create = async ({ userId, githubUsername, platforms, scores, aiInsights, comparison }) => {
  const [result] = await db.query(
    `INSERT INTO reports (user_id, github_username, platforms, scores, ai_insights, comparison)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      userId,
      githubUsername,
      JSON.stringify(platforms || {}),
      JSON.stringify(scores),
      JSON.stringify(aiInsights),
      JSON.stringify(comparison || {}),
    ]
  );
  return result.insertId;
};

const findByUserId = async (userId, { page = 1, limit = 10 } = {}) => {
  const offset = (page - 1) * limit;
  const [[{ total }], [rows]] = await Promise.all([
    db.query('SELECT COUNT(*) AS total FROM reports WHERE user_id = ?', [userId]),
    db.query(
      `SELECT id, github_username, platforms, scores, ai_insights, comparison, created_at
       FROM reports WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    ),
  ]);
  return {
    data: rows.map(parseReport),
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

const findById = async (id) => {
  const [[rows]] = await db.query(
    `SELECT r.*, u.name AS user_name, u.public_slug
     FROM reports r JOIN users u ON r.user_id = u.id WHERE r.id = ?`,
    [id]
  );
  return rows ? parseReport(rows) : null;
};

const findLatestByUserId = async (userId) => {
  const [[rows]] = await db.query(
    `SELECT id, github_username, platforms, scores, ai_insights, comparison, created_at
     FROM reports WHERE user_id = ? ORDER BY created_at DESC LIMIT 1`,
    [userId]
  );
  return rows ? parseReport(rows) : null;
};

function parseReport(r) {
  return {
    ...r,
    platforms:   typeof r.platforms   === 'string' ? JSON.parse(r.platforms)   : r.platforms   || {},
    scores:      typeof r.scores      === 'string' ? JSON.parse(r.scores)      : r.scores,
    ai_insights: typeof r.ai_insights === 'string' ? JSON.parse(r.ai_insights) : r.ai_insights,
    comparison:  typeof r.comparison  === 'string' ? JSON.parse(r.comparison)  : r.comparison  || {},
  };
}

module.exports = { create, findByUserId, findById, findLatestByUserId };
