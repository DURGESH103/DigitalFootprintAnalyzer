const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepo = require('../repositories/user.repository');
const { jwt: jwtConfig } = require('../config/env');
const { INVALID_CREDENTIALS, USER_EXISTS, UNAUTHORIZED } = require('../constants/messages');

const signup = async ({ name, email, password }) => {
  const existing = await userRepo.findByEmail(email);
  if (existing) {
    const err = new Error(USER_EXISTS);
    err.status = 409;
    throw err;
  }
  const hashed = await bcrypt.hash(password, 12);
  const user = await userRepo.create({ name, email, password: hashed });
  return buildTokenPair(user);
};

const login = async ({ email, password }) => {
  const user = await userRepo.findByEmail(email);
  if (!user) throw Object.assign(new Error(INVALID_CREDENTIALS), { status: 401 });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw Object.assign(new Error(INVALID_CREDENTIALS), { status: 401 });

  const { password: _, ...safeUser } = user;
  return buildTokenPair(safeUser);
};

const refresh = async (refreshToken) => {
  try {
    const payload = jwt.verify(refreshToken, jwtConfig.refreshSecret);
    const stored = await userRepo.findRefreshToken(refreshToken);
    if (!stored) throw Object.assign(new Error(UNAUTHORIZED), { status: 401 });

    // Rotate: revoke old, issue new pair
    await userRepo.deleteRefreshToken(refreshToken);
    const user = await userRepo.findById(payload.id);
    if (!user) throw Object.assign(new Error(UNAUTHORIZED), { status: 401 });

    return buildTokenPair(user);
  } catch (err) {
    if (err.status) throw err;
    throw Object.assign(new Error(UNAUTHORIZED), { status: 401 });
  }
};

const logout = async (refreshToken) => {
  await userRepo.deleteRefreshToken(refreshToken);
};

const buildTokenPair = async (user) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    jwtConfig.secret,
    { expiresIn: jwtConfig.expiresIn }
  );
  const refreshToken = jwt.sign(
    { id: user.id },
    jwtConfig.refreshSecret,
    { expiresIn: jwtConfig.refreshExpiresIn }
  );
  await userRepo.saveRefreshToken({ userId: user.id, token: refreshToken });
  const { password: _, ...safeUser } = user;
  return { user: safeUser, accessToken, refreshToken };
};

module.exports = { signup, login, refresh, logout };
