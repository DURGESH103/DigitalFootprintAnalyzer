require('dotenv').config();

const required = [
  'DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME',
  'JWT_SECRET', 'JWT_REFRESH_SECRET',
  'REDIS_HOST',
];

const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`❌ Missing required env vars: ${missing.join(', ')}`);
  process.exit(1);
}

if (process.env.JWT_SECRET.length < 32) {
  console.error('❌ JWT_SECRET must be at least 32 characters');
  process.exit(1);
}

module.exports = {
  env:        process.env.NODE_ENV || 'development',
  port:       parseInt(process.env.PORT, 10) || 3000,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  db: {
    host:     process.env.DB_HOST,
    port:     parseInt(process.env.DB_PORT, 10) || 3306,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name:     process.env.DB_NAME,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  },
  jwt: {
    secret:           process.env.JWT_SECRET,
    expiresIn:        process.env.JWT_EXPIRES_IN        || '15m',
    refreshSecret:    process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  github: {
    token:    process.env.GITHUB_TOKEN,
    topRepos: parseInt(process.env.GITHUB_TOP_REPOS, 10) || 10,
    cacheTtl: parseInt(process.env.GITHUB_CACHE_TTL, 10) || 3600,
  },
  ai: {
    url:     process.env.PYTHON_AI_URL     || 'http://localhost:8000',
    timeout: parseInt(process.env.PYTHON_AI_TIMEOUT, 10) || 30000,
    retries: parseInt(process.env.PYTHON_AI_RETRIES, 10) || 3,
  },
  app: {
    baseUrl:    process.env.APP_BASE_URL    || 'http://localhost:5173',
    uploadDir:  process.env.UPLOAD_DIR      || './uploads',
  },
};
