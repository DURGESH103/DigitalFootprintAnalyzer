const router = require('express').Router();
const { authenticate } = require('../middleware/auth.middleware');
const { validate }     = require('../middleware/validate.middleware');
const { analyzeSchema } = require('../validators/report.validator');
const ctrl = require('../controllers/report.controller');

router.post('/',          authenticate, validate(analyzeSchema), ctrl.analyze);
router.get('/',           authenticate, ctrl.getReports);
router.get('/:id',        authenticate, ctrl.getReport);

module.exports = router;
