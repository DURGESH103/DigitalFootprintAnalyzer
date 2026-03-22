const { analysisQueue } = require('../services/queue.service');
const githubService = require('../services/github.service');
const analysisService = require('../services/analysis.service');
const reportRepo = require('../repositories/report.repository');
const logger = require('../utils/logger');
const redis = require('../config/redis');

const emit = (userId, payload) =>
  redis.publish('progress', JSON.stringify({ userId, ...payload })).catch(() => {});

analysisQueue.on('job', async ({ id, data }) => {
  const { userId, githubUsername } = data;
  try {
    await emit(userId, { step: 'Fetching GitHub data...', percent: 20 });
    const githubData = await githubService.fetchUserData(githubUsername);

    await emit(userId, { step: 'Running AI analysis...', percent: 60 });
    const { scores, aiInsights } = await analysisService.analyze(githubData);

    await emit(userId, { step: 'Saving report...', percent: 90 });
    const reportId = await reportRepo.create({ userId, githubUsername, scores, aiInsights });

    await emit(userId, { step: 'Done', percent: 100, reportId });
    logger.info('Analysis job completed', { jobId: id, reportId });
  } catch (err) {
    logger.error('Analysis job failed', { jobId: id, error: err.message });
    await emit(userId, { step: 'Failed', percent: 0, error: err.message });
  }
});

logger.info('Analysis worker registered');
