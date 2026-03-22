/**
 * Compute consistency score: commits spread across days / total days active
 */
function computeConsistencyScore(commits) {
  if (!commits.length) return 0;
  const days = new Set(commits.map((c) => c.date.slice(0, 10)));
  const totalDays = daysBetween(commits[commits.length - 1].date, commits[0].date) || 1;
  return Math.min(100, Math.round((days.size / totalDays) * 100));
}

/**
 * Compute activity pattern: ratio of daytime commits (6am–6pm)
 */
function computeActivityPattern(commits) {
  if (!commits.length) return { day: 0, night: 0 };
  const day = commits.filter((c) => {
    const hour = new Date(c.date).getUTCHours();
    return hour >= 6 && hour < 18;
  }).length;
  return {
    day: Math.round((day / commits.length) * 100),
    night: Math.round(((commits.length - day) / commits.length) * 100),
  };
}

/**
 * Compute top languages from repos
 */
function computeTopLanguages(repos) {
  const counts = {};
  repos.forEach((r) => {
    if (r.language) counts[r.language] = (counts[r.language] || 0) + 1;
  });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([lang, count]) => ({ lang, count }));
}

/**
 * Engagement score: stars + forks across all repos (capped at 100)
 */
function computeEngagementScore(repos) {
  const total = repos.reduce((sum, r) => sum + r.stargazers_count + r.forks_count, 0);
  return Math.min(100, total);
}

function daysBetween(dateA, dateB) {
  return Math.abs(Math.round((new Date(dateB) - new Date(dateA)) / 86400000));
}

module.exports = {
  computeConsistencyScore,
  computeActivityPattern,
  computeTopLanguages,
  computeEngagementScore,
};
