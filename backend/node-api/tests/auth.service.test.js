const bcrypt = require('bcryptjs');
const authService = require('../src/services/auth.service');
const userRepo = require('../src/repositories/user.repository');

jest.mock('../src/repositories/user.repository');

describe('Auth Service', () => {
  afterEach(() => jest.clearAllMocks());

  describe('signup', () => {
    it('throws 409 if user already exists', async () => {
      userRepo.findByEmail.mockResolvedValue({ id: 1, email: 'test@test.com' });
      await expect(authService.signup({ name: 'Test', email: 'test@test.com', password: '123' }))
        .rejects.toMatchObject({ status: 409 });
    });

    it('creates user and returns token', async () => {
      userRepo.findByEmail.mockResolvedValue(null);
      userRepo.create.mockResolvedValue({ id: 1, name: 'Test', email: 'test@test.com' });
      const result = await authService.signup({ name: 'Test', email: 'test@test.com', password: 'pass123' });
      expect(result).toHaveProperty('token');
      expect(result.user).toHaveProperty('id', 1);
    });
  });

  describe('login', () => {
    it('throws 401 for unknown email', async () => {
      userRepo.findByEmail.mockResolvedValue(null);
      await expect(authService.login({ email: 'x@x.com', password: 'pass' }))
        .rejects.toMatchObject({ status: 401 });
    });

    it('throws 401 for wrong password', async () => {
      const hashed = await bcrypt.hash('correct', 12);
      userRepo.findByEmail.mockResolvedValue({ id: 1, email: 'x@x.com', password: hashed });
      await expect(authService.login({ email: 'x@x.com', password: 'wrong' }))
        .rejects.toMatchObject({ status: 401 });
    });

    it('returns token on valid credentials', async () => {
      const hashed = await bcrypt.hash('pass123', 12);
      userRepo.findByEmail.mockResolvedValue({ id: 1, email: 'x@x.com', password: hashed, name: 'X' });
      const result = await authService.login({ email: 'x@x.com', password: 'pass123' });
      expect(result).toHaveProperty('token');
    });
  });
});
