const reportRepo    = require('../repositories/report.repository');
const { analysisQueue } = require('../services/queue.service');

const analyze = async (req, res, next) => {
  try {
    const { githubUsername, platforms = {} } = req.body;
    const job = await analysisQueue.add('analyze', {
      userId: req.user.id,
      githubUsername,
      platforms,
    });
    res.status(202).json({
      message: 'Analysis started. Listen to socket progress events.',
      jobId: job.id,
    });
  } catch (err) { next(err); }
};

const getReports = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const reports = await reportRepo.findByUserId(userId, { page: +page, limit: +limit });
    res.json(reports);
  } catch (err) { next(err); }
};

const getReport = async (req, res, next) => {
  try {
    const report = await reportRepo.findById(parseInt(req.params.id, 10));
    if (!report) return res.status(404).json({ message: 'Report not found' });
    if (report.user_id !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    res.json(report);
  } catch (err) { next(err); }
};

module.exports = { analyze, getReports, getReport };
