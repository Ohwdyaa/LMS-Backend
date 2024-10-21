const Permissions = require("../models/permissions");
const Module = require("../models/module_permission");
const { err } = require("../utils/customError");

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
async function updatePermission(roleId, permissions) { // update pengecekan nya berdasarkan role_id dan module_id - bulk query
  try { 
    const result = [];
    for(let i = 0; i < permissions.length; i++){

      const {moduleId, update} = permissions[i];

      const existingData = await Permissions.getPermissionByRoleAndModule(roleId, moduleId);
      if (existingData === undefined) {
        // await createPermission(update);
        // console.log("Permission baru telah dibuat.");
        // continue;
        console.error("undifined data");
      } 
      const results = await Permissions.updatePermission(roleId, update); 
      result.push(results);
    }
    return result;
  } catch (error) {
    throw error;
  }
}
async function getAllPermission() {
  try {
    const result = await Permissions.getAllPermission();
    
    if (!result || result.length === 0) {
      throw new Error("No permissions found");
    }
    const permissionList = [];
    
    for (let i = 0; i < result.length; i++) {
      const permission = result[i];
      const listObj = new Object(); 
      listObj.id = permission.id;
      listObj.can_create = permission.can_create
      listObj.can_read = permission.can_read;
      listObj.can_edit = permission.can_edit;
      listObj.can_delete = permission.can_delete;
      listObj.role_id = permission.role;
      listObj.module_permission_id = permission.module;
      permissionList.push(listObj);
    }
    return permissionList;
  } catch (error) {
    throw error;
  }
}
async function getPermissionByRole(roleId) {
  try {
    const result = await Permissions.getPermissionByRole(roleId);
    if (result === undefined) {
      throw new Error("No permissions found");
    }
    return result;
  } catch (error) {
    throw error;
  }
}
async function getPermissions(user) {
  try {
    const permissions = await Permissions.getPermissionByRole(user.role_id);
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
  getAllPermission,
  getPermissionByRole,
  getPermissions
};
