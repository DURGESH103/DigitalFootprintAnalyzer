const router = require('express').Router();
const { getGithubData } = require('../controllers/github.controller');
const { optionalAuth } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { githubUsernameParamSchema } = require('../validators/report.validator');

router.get('/:username', optionalAuth, validate(githubUsernameParamSchema, 'params'), getGithubData);

module.exports = router;
