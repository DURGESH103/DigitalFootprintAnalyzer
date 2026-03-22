const { analysisQueue } = require('../services/queue.service');
const githubService       = require('../services/github.service');
const linkedinService     = require('../services/linkedin.service');
const twitterService      = require('../services/twitter.service');
const stackoverflowService = require('../services/stackoverflow.service');
const analysisService     = require('../services/analysis.service');
const reportRepo          = require('../repositories/report.repository');
const notificationRepo    = require('../repositories/notification.repository');
const logger              = require('../utils/logger');
const redis               = require('../config/redis');

const emit = (userId, payload) =>
  redis.publish('progress', JSON.stringify({ userId, ...payload })).catch(() => {});

analysisQueue.on('job', async ({ id, data }) => {
  const { userId, githubUsername, platforms = {} } = data;

  try {
    // Step 1 — GitHub
    await emit(userId, { step: 'Fetching GitHub data…',     percent: 15 });
    const githubData = await githubService.fetchUserData(githubUsername);

    // Step 2 — LinkedIn (if username provided)
    await emit(userId, { step: 'Fetching LinkedIn data…',   percent: 30 });
    const linkedin = platforms.linkedin
      ? await linkedinService.fetchUserData(platforms.linkedin).catch(() => null)
      : null;

    // Step 3 — Twitter
    await emit(userId, { step: 'Fetching Twitter data…',    percent: 45 });
    const twitter = platforms.twitter
      ? await twitterService.fetchUserData(platforms.twitter).catch(() => null)
      : null;

    // Step 4 — StackOverflow
    await emit(userId, { step: 'Fetching StackOverflow…',   percent: 55 });
    const stackoverflow = platforms.stackoverflow
      ? await stackoverflowService.fetchUserData(platforms.stackoverflow).catch(() => null)
      : null;

    // Step 5 — AI analysis
    await emit(userId, { step: 'Running AI analysis…',      percent: 70 });
    const { scores, aiInsights, comparison } = await analysisService.analyze({
      ...githubData,
      linkedin,
      twitter,
      stackoverflow,
    });

    // Step 6 — Save
    await emit(userId, { step: 'Saving report…',            percent: 90 });
    const reportId = await reportRepo.create({
      userId,
      githubUsername,
      platforms: { linkedin, twitter, stackoverflow },
      scores,
      aiInsights,
      comparison,
    });

    // Notification
    await notificationRepo.create({
      userId,
      type:  'report_ready',
      title: 'Your analysis is ready!',
      body:  `Report for @${githubUsername} has been generated.`,
    }).catch(() => {});

    await emit(userId, { step: 'Done', percent: 100, reportId });
    logger.info('Analysis job completed', { jobId: id, reportId });
  } catch (err) {
    logger.error('Analysis job failed', { jobId: id, error: err.message });
    await emit(userId, { step: 'Failed', percent: 0, error: err.message });
  }
});

logger.info('Analysis worker registered');
