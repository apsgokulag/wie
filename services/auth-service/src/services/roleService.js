const Role = require('../models/Role');

exports.createRole = async (name) => {
  const role = new Role({ name });
  return await role.save();
};

exports.getRoleByName = async (name) => {
  return await Role.findOne({ name });
};