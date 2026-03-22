const router = require('express').Router();
const { authenticate } = require('../middleware/auth.middleware');
const ctrl = require('../controllers/chat.controller');

router.post('/',    authenticate, ctrl.sendMessage);
router.get('/',     authenticate, ctrl.getHistory);
router.delete('/',  authenticate, ctrl.clearHistory);

module.exports = router;
