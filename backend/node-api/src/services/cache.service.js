const redis = require('../config/redis');

const CACHE_TTL = 3600; // 1 hour

const get = async (key) => {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
};

const set = async (key, value, ttl = CACHE_TTL) => {
  await redis.set(key, JSON.stringify(value), 'EX', ttl);
};

const del = async (key) => {
  await redis.del(key);
};

module.exports = { get, set, del };
