const publicService = require('../services/public.service');

const getProfile = async (req, res, next) => {
  try {
    const profile = await publicService.getPublicProfile(req.params.slug);
    if (!profile) return res.status(404).json({ message: 'Public profile not found' });
    res.json(profile);
  } catch (err) { next(err); }
};

const updateSettings = async (req, res, next) => {
  try {
    const { isPublic, slug } = req.body;
    await publicService.updatePublicSettings(req.user.id, { isPublic, slug });
    res.json({ message: 'Public profile settings updated' });
  } catch (err) { next(err); }
};

module.exports = { getProfile, updateSettings };
