const router = require('express').Router();

router.use('/auth', require('./auth.routes'));
router.use('/github', require('./github.routes'));
router.use('/report', require('./report.routes'));

module.exports = router;
