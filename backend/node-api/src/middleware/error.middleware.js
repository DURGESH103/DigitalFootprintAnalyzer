const logger = require('../utils/logger');
const { SERVER_ERROR } = require('../constants/messages');

module.exports = (err, req, res, next) => {
  logger.error(err.message, { stack: err.stack });
  const status = err.status || 500;
  res.status(status).json({ message: err.message || SERVER_ERROR });
};
