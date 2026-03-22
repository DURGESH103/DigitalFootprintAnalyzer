const router = require('express').Router();
const { authenticate } = require('../middleware/auth.middleware');
const ctrl = require('../controllers/platform.controller');

router.get('/',                authenticate, ctrl.getConnected);
router.post('/',               authenticate, ctrl.connect);
router.delete('/:provider',    authenticate, ctrl.disconnect);

module.exports = router;
