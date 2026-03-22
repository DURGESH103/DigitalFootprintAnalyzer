const db = require('../config/db');
const reportRepo = require('../repositories/report.repository');

const getPublicProfile = async (slug) => {
  const [[user]] = await db.query(
    'SELECT id, name, avatar_url, public_slug, is_public, created_at FROM users WHERE public_slug = ? AND is_public = 1',
    [slug]
  );
  if (!user) return null;

  const { data: reports } = await reportRepo.findByUserId(user.id, { page: 1, limit: 5 });
  const latest = reports[0] || null;

  return {
    name:       user.name,
    slug:       user.public_slug,
    avatarUrl:  user.avatar_url,
    memberSince: user.created_at,
    totalReports: reports.length,
    latestReport: latest ? {
      githubUsername: latest.github_username,
      scores:         latest.scores,
      aiInsights:     latest.ai_insights,
      comparison:     latest.comparison,
      createdAt:      latest.created_at,
    } : null,
  };
};

const updatePublicSettings = async (userId, { isPublic, slug }) => {
  if (slug) {
    // Check slug uniqueness
    const [[existing]] = await db.query(
      'SELECT id FROM users WHERE public_slug = ? AND id != ?', [slug, userId]
    );
    if (existing) throw Object.assign(new Error('Slug already taken'), { status: 409 });
  }
  await db.query(
    'UPDATE users SET is_public = ?, public_slug = COALESCE(?, public_slug) WHERE id = ?',
    [isPublic ? 1 : 0, slug || null, userId]
  );
};

module.exports = { getPublicProfile, updatePublicSettings };
