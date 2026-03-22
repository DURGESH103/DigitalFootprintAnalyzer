const client = require('prom-client');

const register = new client.Registry();

// Collect default Node.js metrics (event loop lag, memory, CPU, etc.)
client.collectDefaultMetrics({ register });

const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
  registers: [register],
});

const analysisJobCounter = new client.Counter({
  name: 'analysis_jobs_total',
  help: 'Total analysis jobs enqueued',
  labelNames: ['status'],
  registers: [register],
});

const githubCacheHitCounter = new client.Counter({
  name: 'github_cache_hits_total',
  help: 'GitHub API cache hits vs misses',
  labelNames: ['result'], // 'hit' | 'miss'
  registers: [register],
});

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route'],
  buckets: [0.05, 0.1, 0.3, 0.5, 1, 2, 5],
  registers: [register],
});

module.exports = {
  register,
  httpRequestCounter,
  analysisJobCounter,
  githubCacheHitCounter,
  httpRequestDuration,
};
