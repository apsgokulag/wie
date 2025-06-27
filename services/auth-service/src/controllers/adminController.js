exports.getAdminDashboard = async (req, res) => {
  res.json({ message: 'Admin dashboard data', user: req.user });
};