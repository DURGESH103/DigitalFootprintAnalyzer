const router = require('express').Router();
const { authenticate } = require('../middleware/auth.middleware');
const ctrl = require('../controllers/public.controller');

router.get('/:slug',    ctrl.getProfile);
router.patch('/settings', authenticate, ctrl.updateSettings);

module.exports = router;
