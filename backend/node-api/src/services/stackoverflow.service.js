const axios = require('axios');
const cache = require('./cache.service');
const logger = require('../utils/logger');

const so = axios.create({ baseURL: 'https://api.stackexchange.com/2.3' });

const fetchUserData = async (username) => {
  const cacheKey = `stackoverflow:${username}`;
  const cached = await cache.get(cacheKey);
  if (cached) return cached;

  try {
    // Search by display name
    const searchRes = await so.get('/users', {
      params: { inname: username, site: 'stackoverflow', pagesize: 1, order: 'desc', sort: 'reputation' },
    });

    if (!searchRes.data.items?.length) {
      return null;
    }

    const user = searchRes.data.items[0];
    const userId = user.user_id;

    const [answersRes, badgesRes] = await Promise.allSettled([
      so.get(`/users/${userId}/answers`, { params: { site: 'stackoverflow', pagesize: 100, order: 'desc', sort: 'votes' } }),
      so.get(`/users/${userId}/badges`,  { params: { site: 'stackoverflow', pagesize: 100 } }),
    ]);

    const answers = answersRes.status === 'fulfilled' ? answersRes.value.data.items : [];
    const badges  = badgesRes.status  === 'fulfilled' ? badgesRes.value.data.items  : [];

    const data = {
      username,
      displayName:    user.display_name,
      reputation:     user.reputation,
      answers:        answers.length,
      acceptedAnswers: answers.filter(a => a.is_accepted).length,
      totalVotes:     answers.reduce((s, a) => s + a.score, 0),
      goldBadges:     badges.filter(b => b.rank === 'gold').length,
      silverBadges:   badges.filter(b => b.rank === 'silver').length,
      bronzeBadges:   badges.filter(b => b.rank === 'bronze').length,
      profileUrl:     user.link,
      topTags:        user.tags || [],
    };

    await cache.set(cacheKey, data, 3600);
    return data;
  } catch (err) {
    logger.warn('StackOverflow fetch failed', { username, message: err.message });
    return null;
  }
};

module.exports = { fetchUserData };
