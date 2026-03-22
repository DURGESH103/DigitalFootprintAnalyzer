const axios = require('axios');
const axiosRetry = require('axios-retry').default;
const { ai } = require('../config/env');
const {
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
} = require('../utils/score.util');
const { ANALYSIS_ERROR } = require('../constants/messages');
const logger = require('../utils/logger');

const aiClient = axios.create({ baseURL: ai.url, timeout: ai.timeout });

axiosRetry(aiClient, {
  retries: ai.retries,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (err) => axiosRetry.isNetworkError(err) || axiosRetry.isRetryableError(err),
  onRetry: (count, err) => logger.warn(`AI retry #${count}: ${err.message}`),
});

const REQUIRED_KEYS = ['personality_type', 'strengths', 'weaknesses', 'suggestions', 'summary'];

const analyze = async ({ profile, repos, commits, linkedin, twitter, stackoverflow }) => {
  const topLanguages = computeTopLanguages(repos);
  const activityPattern = computeActivityPattern(commits);
  const consistency  = computeConsistencyScore(commits);
  const engagement   = computeEngagementScore(repos);
  const visibility   = computeVisibilityScore({ profile, repos, linkedin, twitter, stackoverflow });
  const growth       = computeGrowthScore(commits);
  const influence    = computeInfluenceScore({ repos, stackoverflow, twitter });
  const weeklyTrend  = computeWeeklyTrend(commits);

  const scores = {
    consistency,
    engagement,
    visibility,
    growth,
    influence,
    activityPattern,
    topLanguages,
    weeklyTrend,
    totalRepos:  repos.length,
    totalStars:  repos.reduce((s, r) => s + r.stargazers_count, 0),
    totalForks:  repos.reduce((s, r) => s + r.forks_count, 0),
    totalCommits: commits.length,
  };

  scores.hireability = computeHireabilityScore(scores);
  const comparison   = computeComparison(scores);

  const payload = {
    username:      profile.login,
    bio:           profile.bio,
    public_repos:  profile.public_repos,
    followers:     profile.followers,
    scores,
    top_languages: topLanguages.map((l) => l.lang),
    sample_commits: commits.slice(0, 10).map((c) => c.message),
    linkedin:      linkedin  ? { headline: linkedin.headline, connections: linkedin.connections, skills: linkedin.skills } : null,
    twitter:       twitter   ? { followers: twitter.followers, tweetsPerMonth: twitter.tweetsPerMonth, topTopics: twitter.topTopics } : null,
    stackoverflow: stackoverflow ? { reputation: stackoverflow.reputation, answers: stackoverflow.answers } : null,
  };

  try {
    const { data } = await aiClient.post('/analyze', payload);
    const missing = REQUIRED_KEYS.filter((k) => !(k in data));
    if (missing.length) throw Object.assign(new Error(ANALYSIS_ERROR), { status: 502 });
    return { scores, aiInsights: data, comparison };
  } catch (err) {
    if (err.status) throw err;
    logger.error('AI service failed', { message: err.message });
    throw Object.assign(new Error(ANALYSIS_ERROR), { status: 502 });
  }
};

module.exports = { analyze };
