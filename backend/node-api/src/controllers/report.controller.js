const reportRepo = require('../repositories/report.repository');
const { analysisQueue } = require('../services/queue.service');

const analyze = async (req, res, next) => {
  try {
    const { githubUsername } = req.body;
    const userId = req.user.id;

    const job = await analysisQueue.add('analyze', { userId, githubUsername });
    res.status(202).json({
      message: 'Analysis started. Listen to socket progress events.',
      jobId: job.id,
    });
  } catch (err) {
    next(err);
  }
};

const getReport = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const { page, limit } = req.query;
    const reports = await reportRepo.findByUserId(userId, { page, limit });
    res.json(reports);
  } catch (err) {
    next(err);
  }
};

module.exports = { analyze, getReport };
