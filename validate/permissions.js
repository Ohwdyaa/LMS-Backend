const Permissions = require("../models/permissions");
const Module = require('../models/module_permission');

async function createRolePermission(dataPermissions) {
    try {
      const rolePermission = await Permissions.createRolePermission(dataPermissions);
      const modulePermission = await Module.getModuleById(dataPermissions.modulePermissionId);
  
      return {
        rolePermission: rolePermission,
        modulePermission: modulePermission
      };
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
    getPermissions,
    createRolePermission
}