const router = require('express').Router();
const { signup, login, refresh, logout } = require('../controllers/auth.controller');
const { authLimiter } = require('../middleware/rateLimit.middleware');
const validate = require('../middleware/validate.middleware');
const { signupSchema, loginSchema, refreshSchema } = require('../validators/auth.validator');

router.post('/signup', authLimiter, validate(signupSchema), signup);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/refresh', authLimiter, validate(refreshSchema), refresh);
router.post('/logout', validate(refreshSchema), logout);

module.exports = router;
