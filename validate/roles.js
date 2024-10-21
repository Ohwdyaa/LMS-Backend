const Roles = require("../models/roles");
const { CustomError } = require("../utils/customError");

async function createRole(roleData) {
  try {
    const roleId = await Roles.createRole(roleData);
    return roleId;
  } catch (error) {
    throw error;
  }
}
async function getRoleById(roleId) {
  try {
    const role = await Roles.getRoleById(roleId);
    if (role === undefined) {
      throw new CustomError("Role not found");
    }
    return role;
  } catch (error) {
    throw error;
  }
}
async function getAllRoles() {
  try {
    const roles = await Roles.getAllRoles();
    const filteredRoles = [];
    for (let i = 0; i < roles.length; i++) {
      filteredRoles.push({
        id: roles[i].id,
        name: roles[i].name
      });
    }

    return filteredRoles;
    return roles;
  } catch (error) {
    throw error;
  }
}
async function deleteRole(roleId) {
  try {
    const deleteRoles = await Roles.deleteRole(roleId);
    return deleteRoles;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createRole,
  getRoleById,
  getAllRoles,
  deleteRole,
};
