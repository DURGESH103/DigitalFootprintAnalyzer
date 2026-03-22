const axios = require('axios');
const { github } = require('../config/env');
const cache = require('./cache.service');
const { GITHUB_FETCH_ERROR } = require('../constants/messages');
const logger = require('../utils/logger');

const gh = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    ...(github.token && { Authorization: `Bearer ${github.token}` }),
    Accept: 'application/vnd.github+json',
  },
});

const fetchUserData = async (username) => {
  const cacheKey = `github:${username}`;
  const cached = await cache.get(cacheKey);
  if (cached) {
    logger.info('GitHub cache hit', { username });
    return cached;
  }

  try {
    const [profileRes, reposRes] = await Promise.all([
      gh.get(`/users/${username}`),
      gh.get(`/users/${username}/repos?per_page=100&sort=updated`),
    ]);

    const profile = profileRes.data;
    const repos = reposRes.data;

    const topRepos = repos.slice(0, github.topRepos);
    const commitResults = await Promise.allSettled(
      topRepos.map((r) =>
        gh.get(`/repos/${username}/${r.name}/commits?per_page=100&author=${username}`)
      )
    );

    const commits = commitResults
      .filter((r) => r.status === 'fulfilled')
      .flatMap((r) =>
        r.value.data.map((c) => ({
          sha: c.sha,
          message: c.commit.message,
          date: c.commit.author.date,
        }))
      );

    const data = { profile, repos, commits };
    await cache.set(cacheKey, data, github.cacheTtl);
    return data;
  } catch (err) {
    if (err.response?.status === 403) {
      throw Object.assign(
        new Error('GitHub API rate limit exceeded. Try again later.'),
        { status: 429 }
      );
    }
    if (err.response?.status === 404) {
      throw Object.assign(
        new Error(`GitHub user "${username}" not found.`),
        { status: 404 }
      );
    }
    logger.error('GitHub fetch failed', { username, message: err.message });
    throw Object.assign(new Error(GITHUB_FETCH_ERROR), { status: 502 });
  }
};

module.exports = { fetchUserData };
