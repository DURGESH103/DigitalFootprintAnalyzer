const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./routes/index');
const errorMiddleware = require('./middleware/error.middleware');
const { apiLimiter } = require('./middleware/rateLimit.middleware');
const { corsOrigin } = require('./config/env');
const metrics = require('./utils/metrics');

const app = express();

// Security headers
app.use(helmet());

// Restricted CORS
app.use(cors({
  origin: corsOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json({ limit: '10kb' }));

// Prometheus metrics endpoint (unauthenticated, internal use)
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', metrics.register.contentType);
  res.end(await metrics.register.metrics());
});

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

// Versioned API
app.use('/api/v1', apiLimiter);
app.use('/api/v1', routes);

app.use(errorMiddleware);

module.exports = app;
