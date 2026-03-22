const cache = require('./cache.service');
const logger = require('../utils/logger');

/**
 * Twitter/X data collector.
 * Uses mock data — replace with Twitter API v2 Bearer token calls in production.
 */
const fetchUserData = async (username) => {
  const cacheKey = `twitter:${username}`;
  const cached = await cache.get(cacheKey);
  if (cached) return cached;

  logger.info('Twitter: generating mock data', { username });

  const seed = username.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const rand = (min, max) => min + (seed % (max - min + 1));

  const data = {
    username,
    displayName: username,
    followers: rand(50, 15000),
    following: rand(50, 2000),
    tweets: rand(20, 3000),
    tweetsPerMonth: rand(2, 60),
    likes: rand(100, 50000),
    retweets: rand(10, 5000),
    avgEngagementRate: parseFloat((rand(1, 8) + (seed % 10) / 10).toFixed(2)),
    topTopics: pickTopics(seed),
    accountAgeDays: rand(180, 3650),
    verified: seed % 10 === 0,
    techTweets: rand(30, 90), // % of tweets that are tech-related
  };

  await cache.set(cacheKey, data, 3600);
  return data;
};

function pickTopics(seed) {
  const topics = [
    'JavaScript', 'Open Source', 'Web Dev', 'AI/ML', 'DevOps',
    'Career', 'Startups', 'Python', 'Cloud', 'Security',
  ];
  const count = 3 + (seed % 4);
  return topics.slice(seed % 4, (seed % 4) + count);
}

module.exports = { fetchUserData };
