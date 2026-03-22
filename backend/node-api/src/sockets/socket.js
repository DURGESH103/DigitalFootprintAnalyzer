const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const Redis = require('ioredis');
const { jwt: jwtConfig, redis: redisConfig, corsOrigin } = require('../config/env');
const { registerEvents } = require('./events');
const logger = require('../utils/logger');

let io;

const init = (httpServer) => {
  io = new Server(httpServer, {
    cors: { origin: corsOrigin, credentials: true },
    transports: ['polling', 'websocket'],
    allowUpgrades: true,
  });

  // JWT authentication on every socket connection
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Unauthorized'));
    try {
      socket.user = jwt.verify(token, jwtConfig.secret);
      next();
    } catch {
      next(new Error('Unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user.id.toString();
    socket.join(userId);
    logger.info('Socket connected', { userId });
    registerEvents(socket);
  });

  // Subscribe to Redis pub/sub channel published by the worker process
  const subscriber = new Redis({ host: redisConfig.host, port: redisConfig.port });
  subscriber.subscribe('progress');
  subscriber.on('message', (_, message) => {
    try {
      const { userId, ...payload } = JSON.parse(message);
      io.to(userId.toString()).emit('progress', payload);
    } catch (err) {
      logger.error('Failed to parse progress message', { error: err.message });
    }
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
};

module.exports = { init, getIO };
