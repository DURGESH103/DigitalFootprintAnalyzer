const chatService = require('../services/chat.service');
const chatRepo    = require('../repositories/chat.repository');

const sendMessage = async (req, res, next) => {
  try {
    const { message, reportId } = req.body;
    const result = await chatService.chat({ userId: req.user.id, reportId, message });
    res.json(result);
  } catch (err) { next(err); }
};

const getHistory = async (req, res, next) => {
  try {
    const reportId = req.query.reportId ? parseInt(req.query.reportId, 10) : null;
    const history  = await chatRepo.getHistory(req.user.id, reportId);
    res.json(history);
  } catch (err) { next(err); }
};

const clearHistory = async (req, res, next) => {
  try {
    const reportId = req.query.reportId ? parseInt(req.query.reportId, 10) : null;
    await chatRepo.clearHistory(req.user.id, reportId);
    res.json({ message: 'Chat history cleared' });
  } catch (err) { next(err); }
};

module.exports = { sendMessage, getHistory, clearHistory };
