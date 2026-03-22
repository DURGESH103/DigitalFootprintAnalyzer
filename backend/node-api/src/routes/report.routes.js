const router = require('express').Router();
const { analyze, getReport } = require('../controllers/report.controller');
const { authenticate } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { analyzeSchema, paginationSchema } = require('../validators/report.validator');

router.post('/analyze', authenticate, validate(analyzeSchema), analyze);
router.get('/:userId', authenticate, validate(paginationSchema, 'query'), getReport);

module.exports = router;
