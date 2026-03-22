const axios = require('axios');
const axiosRetry = require('axios-retry').default;
const { ai } = require('../config/env');
const {
  computeConsistencyScore,
  computeActivityPattern,
  computeTopLanguages,
  computeEngagementScore,
} = require('../utils/score.util');
const { ANALYSIS_ERROR } = require('../constants/messages');
const logger = require('../utils/logger');

const aiClient = axios.create({
  baseURL: ai.url,
  timeout: ai.timeout,
});

// Retry on network errors and 5xx responses, with exponential backoff
axiosRetry(aiClient, {
  retries: ai.retries,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (err) =>
    axiosRetry.isNetworkError(err) || axiosRetry.isRetryableError(err),
  onRetry: (count, err) =>
    logger.warn(`AI service retry #${count}: ${err.message}`),
});

const REQUIRED_INSIGHT_KEYS = ['personality_type', 'strengths', 'weaknesses', 'suggestions', 'summary'];

const analyze = async ({ profile, repos, commits }) => {
  const scores = {
    consistency: computeConsistencyScore(commits),
    activityPattern: computeActivityPattern(commits),
    topLanguages: computeTopLanguages(repos),
    engagement: computeEngagementScore(repos),
    totalRepos: repos.length,
    totalStars: repos.reduce((s, r) => s + r.stargazers_count, 0),
    totalForks: repos.reduce((s, r) => s + r.forks_count, 0),
  };

  const payload = {
    username: profile.login,
    bio: profile.bio,
    public_repos: profile.public_repos,
    followers: profile.followers,
    scores,
    top_languages: scores.topLanguages.map((l) => l.lang),
    sample_commits: commits.slice(0, 10).map((c) => c.message),
  };

  try {
    const { data } = await aiClient.post('/analyze', payload);

    // Validate AI response shape before storing
    const missing = REQUIRED_INSIGHT_KEYS.filter((k) => !(k in data));
    if (missing.length) {
      logger.error('AI response missing keys', { missing, data });
      throw Object.assign(new Error(ANALYSIS_ERROR), { status: 502 });
    }

    return { scores, aiInsights: data };
  } catch (err) {
    if (err.status) throw err;
    logger.error('AI service call failed', { message: err.message, code: err.code });
    throw Object.assign(new Error(ANALYSIS_ERROR), { status: 502 });
  }
};

module.exports = { analyze };
