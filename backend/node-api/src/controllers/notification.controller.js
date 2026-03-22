const notificationRepo = require('../repositories/notification.repository');

const getAll = async (req, res, next) => {
  try {
    const notifications = await notificationRepo.findByUserId(req.user.id);
    const unread        = await notificationRepo.getUnreadCount(req.user.id);
    res.json({ notifications, unread });
  } catch (err) { next(err); }
};

const markRead = async (req, res, next) => {
  try {
    await notificationRepo.markAllRead(req.user.id);
    res.json({ message: 'All notifications marked as read' });
  } catch (err) { next(err); }
};

module.exports = { getAll, markRead };
