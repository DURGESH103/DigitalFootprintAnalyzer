const logger = require('../utils/logger');

const registerEvents = (socket) => {
  socket.on('disconnect', (reason) => {
    logger.info('Socket disconnected', { userId: socket.user?.id, reason });
    // Leave all rooms on disconnect (Socket.io does this automatically,
    // but we log it for observability)
    socket.rooms.forEach((room) => socket.leave(room));
  });

  socket.on('error', (err) => {
    logger.error('Socket error', { userId: socket.user?.id, error: err.message });
  });
};

module.exports = { registerEvents };
