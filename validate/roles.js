const Roles = require("../models/roles");
const { CustomError, err } = require("../utils/customError");

async function createRole(roleData) {
  try {
    const roleId = await Roles.createRole(roleData);
    return roleId;
  } catch (error) {
    throw new error;
  }
}
async function getRoleById(roleId) {
  try {
    const role = await Roles.getRoleById(roleId);
    if (!role) {
      throw new CustomError("Role not found", 404);
    }
    return role;
  } catch (error) {
    throw new error;
  }
}
async function getAllRoles() {
  try {
    const roles = await Roles.getAllRoles();
    return roles;
  } catch (error) {
    throw new error;
  }
}
async function deleteRole(roleId) {
  try {
    const deleteRoles = await Roles.deleteRole(roleId);
    return deleteRoles;
  } catch (error) {
    throw new error;
  }
}

module.exports = {
  createRole,
  getRoleById,
  getAllRoles,
  deleteRole,
};
