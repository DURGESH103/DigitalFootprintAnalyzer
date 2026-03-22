const githubService = require('../services/github.service');
const accountRepo = require('../repositories/account.repository');

const getGithubData = async (req, res, next) => {
  try {
    const { username } = req.params;
    const data = await githubService.fetchUserData(username);

    if (req.user) {
      await accountRepo.upsert({ userId: req.user.id, provider: 'github', username });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
};

module.exports = { getGithubData };
