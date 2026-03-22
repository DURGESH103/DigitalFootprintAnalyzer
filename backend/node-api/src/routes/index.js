const router = require('express').Router();
const auth   = require('../middleware/auth.middleware');

router.use('/auth',          require('./auth.routes'));
router.use('/github',        require('./github.routes'));
router.use('/report',        require('./report.routes'));
router.use('/chat',          require('./chat.routes'));
router.use('/notifications', require('./notification.routes'));
router.use('/platforms',     require('./platform.routes'));
router.use('/public',        require('./public.routes'));

module.exports = router;
