exports.getUserProfile = async (req, res) => {
  res.json({ message: 'User profile data', user: req.user });
};