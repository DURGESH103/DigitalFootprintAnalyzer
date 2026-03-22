/** Consistency: commit spread across active days */
function computeConsistencyScore(commits) {
  if (!commits.length) return 0;
  const days = new Set(commits.map((c) => c.date.slice(0, 10)));
  const totalDays = daysBetween(commits[commits.length - 1].date, commits[0].date) || 1;
  return Math.min(100, Math.round((days.size / totalDays) * 100));
}

/** Activity pattern: day vs night commit ratio */
function computeActivityPattern(commits) {
  if (!commits.length) return { day: 0, night: 0 };
  const day = commits.filter((c) => {
    const h = new Date(c.date).getUTCHours();
    return h >= 6 && h < 18;
  }).length;
  return {
    day:   Math.round((day / commits.length) * 100),
    night: Math.round(((commits.length - day) / commits.length) * 100),
  };
}

/** Top languages from repos */
function computeTopLanguages(repos) {
  const counts = {};
  repos.forEach((r) => { if (r.language) counts[r.language] = (counts[r.language] || 0) + 1; });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7)
    .map(([lang, count]) => ({ lang, count }));
}

/** Engagement: stars + forks (capped 100) */
function computeEngagementScore(repos) {
  const total = repos.reduce((s, r) => s + r.stargazers_count + r.forks_count, 0);
  return Math.min(100, total);
}

/** Visibility: followers + stars + forks + social presence */
function computeVisibilityScore({ profile, repos, linkedin, twitter, stackoverflow }) {
  let score = 0;
  score += Math.min(30, Math.round((profile.followers || 0) / 10));
  score += Math.min(20, repos.reduce((s, r) => s + r.stargazers_count, 0) / 5);
  if (linkedin) score += Math.min(20, Math.round(linkedin.connections / 100));
  if (twitter)  score += Math.min(20, Math.round(twitter.followers / 500));
  if (stackoverflow) score += Math.min(10, Math.round(stackoverflow.reputation / 1000));
  return Math.min(100, Math.round(score));
}

/** Growth: recent activity vs older activity */
function computeGrowthScore(commits) {
  if (commits.length < 10) return 50;
  const now = Date.now();
  const thirtyDays = 30 * 86400000;
  const ninetyDays  = 90 * 86400000;
  const recent = commits.filter(c => now - new Date(c.date).getTime() < thirtyDays).length;
  const older  = commits.filter(c => {
    const age = now - new Date(c.date).getTime();
    return age >= thirtyDays && age < ninetyDays;
  }).length;
  if (older === 0) return recent > 0 ? 80 : 30;
  const ratio = recent / older;
  return Math.min(100, Math.round(ratio * 50));
}

/** Influence: stars + forks + SO reputation + Twitter followers */
function computeInfluenceScore({ repos, stackoverflow, twitter }) {
  let score = 0;
  const stars = repos.reduce((s, r) => s + r.stargazers_count, 0);
  const forks  = repos.reduce((s, r) => s + r.forks_count, 0);
  score += Math.min(40, Math.round((stars + forks) / 10));
  if (stackoverflow) score += Math.min(30, Math.round(stackoverflow.reputation / 500));
  if (twitter)       score += Math.min(30, Math.round(twitter.followers / 300));
  return Math.min(100, Math.round(score));
}

/** Hireability: composite of all scores */
function computeHireabilityScore(scores) {
  const raw =
    scores.consistency  * 0.25 +
    scores.engagement   * 0.20 +
    scores.visibility   * 0.20 +
    scores.growth       * 0.15 +
    scores.influence    * 0.10 +
    Math.min(scores.totalRepos * 1.5, 10);
  return Math.min(100, Math.round(raw));
}

/** Weekly commit trend (last 12 weeks) */
function computeWeeklyTrend(commits) {
  const weeks = {};
  commits.forEach((c) => {
    const d = new Date(c.date);
    const weekStart = new Date(d);
    weekStart.setUTCDate(d.getUTCDate() - d.getUTCDay());
    const key = weekStart.toISOString().slice(0, 10);
    weeks[key] = (weeks[key] || 0) + 1;
  });
  return Object.entries(weeks)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-12)
    .map(([week, count]) => ({ week, count }));
}

/** Comparison percentiles vs average developer benchmarks */
function computeComparison(scores) {
  const benchmarks = {
    consistency: 35,
    engagement:  20,
    visibility:  15,
    growth:      45,
    influence:   10,
    hireability: 50,
  };
  const result = {};
  for (const [key, avg] of Object.entries(benchmarks)) {
    const val = scores[key] ?? 0;
    const percentile = Math.min(99, Math.round((val / (avg * 2)) * 50 + 25));
    result[key] = {
      score:      val,
      avg,
      percentile,
      label:      percentile >= 70 ? 'above average' : percentile >= 40 ? 'average' : 'below average',
    };
  }
  return result;
}

function daysBetween(dateA, dateB) {
  return Math.abs(Math.round((new Date(dateB) - new Date(dateA)) / 86400000));
}

module.exports = {
  computeConsistencyScore,
  computeActivityPattern,
  computeTopLanguages,
  computeEngagementScore,
  computeVisibilityScore,
  computeGrowthScore,
  computeInfluenceScore,
  computeHireabilityScore,
  computeWeeklyTrend,
  computeComparison,
};
