const Redis = require('ioredis');
const { redis } = require('./env');
const logger = require('../utils/logger');

const client = new Redis({
  host: redis.host,
  port: redis.port,
  lazyConnect: true,
  maxRetriesPerRequest: null,
  retryStrategy: (times) => {
    if (times > 5) {
      logger.error('Redis: max reconnect attempts reached, giving up');
      return null; // stop retrying
    }
    return Math.min(times * 500, 3000);
  },
});

client.on('error', (err) => logger.error('Redis error:', err.message));
client.on('connect', () => logger.info('Redis connected'));

client.connect().catch((err) => logger.warn('Redis unavailable on startup:', err.message));

module.exports = client;
