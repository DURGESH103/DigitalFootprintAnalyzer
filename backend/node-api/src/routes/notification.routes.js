const router = require('express').Router();
const { authenticate } = require('../middleware/auth.middleware');
const ctrl = require('../controllers/notification.controller');

router.get('/',       authenticate, ctrl.getAll);
router.patch('/read', authenticate, ctrl.markRead);

module.exports = router;
