const jwt = require('jsonwebtoken');
const { jwt: jwtConfig } = require('../config/env');
const { UNAUTHORIZED } = require('../constants/messages');

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: UNAUTHORIZED });

  try {
    req.user = jwt.verify(token, jwtConfig.secret);
    next();
  } catch {
    res.status(401).json({ message: UNAUTHORIZED });
  }
};

/**
 * Soft auth — attaches req.user if token present, never blocks the request
 */
const optionalAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    try {
      req.user = jwt.verify(token, jwtConfig.secret);
    } catch {
      // token invalid — proceed as unauthenticated
    }
  }
  next();
};

module.exports = { authenticate, optionalAuth };
