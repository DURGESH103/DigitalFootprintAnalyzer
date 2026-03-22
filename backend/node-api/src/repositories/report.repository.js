const db = require('../config/db');

const create = async ({ userId, githubUsername, scores, aiInsights }) => {
  const [result] = await db.query(
    'INSERT INTO reports (user_id, github_username, scores, ai_insights) VALUES (?, ?, ?, ?)',
    [userId, githubUsername, JSON.stringify(scores), JSON.stringify(aiInsights)]
  );
  return result.insertId;
};

const findByUserId = async (userId, { page = 1, limit = 10 } = {}) => {
  const offset = (page - 1) * limit;

  const [[{ total }], rows] = await Promise.all([
    db.query('SELECT COUNT(*) AS total FROM reports WHERE user_id = ?', [userId]),
    db.query(
      `SELECT id, github_username, scores, ai_insights, created_at
       FROM reports WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    ),
  ]);

  return {
    data: rows[0].map((r) => ({
      ...r,
      scores: JSON.parse(r.scores),
      ai_insights: JSON.parse(r.ai_insights),
    })),
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

module.exports = { create, findByUserId };
