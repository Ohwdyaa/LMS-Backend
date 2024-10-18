const Permissions = require("../models/permissions");
const Module = require("../models/module_permission");

async function createPermission(roleId) {
  try {
    const allModule = await Module.getAllModule();

    for(let i = 0; i < allModule.length; i++){
      const module = allModule[i];
      await Permissions.createPermission({
        can_create: 0,
        can_read: 0,
        can_edit: 0,
        can_delete: 0,
        roleId: roleId,
        modulePermissionId: module.id,
      });
    }
  } catch (error) {
    throw error;
  }
}
async function updatePermission(permissionId, dataPermissions) {
  try {
    const idPermission = await Permissions.getPermissionById(permissionId)
    if (idPermission === undefined) {
      throw new Error("User not found");
    }
    await Permissions.updatePermission(permissionId, dataPermissions);
  } catch (error) {
    throw error;
  }
}
async function getPermissions(user) {
  try {
    const permissions = await Permissions.getPermissionsByRoleid(user.role_id);
    if (permissions === undefined) {
      throw new Error("Permissions not found for this role");
    }
    return permissions;
  } catch (error) {
    throw error;
  }
}
module.exports = {
  createPermission,
  updatePermission,
  getPermissions
};
