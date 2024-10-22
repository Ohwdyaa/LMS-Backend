const Permissions = require("../models/permissions");
const Module = require("../models/module_permission");
const { err } = require("../utils/customError");
const Roles = require("../models/roles");

async function createPermission(req, res) {
  const { roleId, listModules } = req.body;
  try {
    const allModule = await Module.getAllModule();

    for (let i = 0; i < allModule.length; i++) {
      const module = allModule[i];
      let permissionData = {
        can_create: 0,
        can_read: 0,
        can_edit: 0,
        can_delete: 0,
        roleId: roleId,
        moduleId: module.id,
      }
      for (let j = 0; j < listModules.length; j++) {
        if (listModules[j].moduleId === module.id.toString()) {
          permissionData.can_create = listModules[j].canCreate ? 1 : 0;
          permissionData.can_read = listModules[j].canRead ? 1 : 0;
          permissionData.can_edit = listModules[j].canUpdate ? 1 : 0;
          permissionData.can_delete = listModules[j].canDelete ? 1 : 0;
          break; 
        }
      }
      await Permissions.createPermission(permissionData);
    }
    res.status(200).json({ message: "Permissions created successfully" });
  } catch (error) {
    res.status(err.errorCreate.statusCode).json({
      message: err.errorCreate.message,
      error: error.message
    });
  }
}
async function updatePermission(req, res) {
  const {id: roleId} = req.params;
  const {listModules} = req.body;
  const result = [];
  try {
    const isRoleExists = await Roles.getRoleById(roleId);
    if (!isRoleExists) {
      return res.status(404).json({ message: "Role not found" });
    }
    console.log('data', listModules.length)
    for (let i = 0; i < listModules.length; i++) {
      const { moduleId, canRead, canCreate, canUpdate, canDelete } = listModules[i]; 
      
      const existingData = await Permissions.getPermissionByRoleAndModule(roleId, moduleId);
      
      const updateData = {
        can_read: canRead, 
        can_create: canCreate, 
        can_edit: canUpdate, 
        can_delete: canDelete, 
      };
      if (existingData) {
        const updatedPermission = await Permissions.updatePermission(roleId, moduleId, updateData);
        result.push(updatedPermission); 
      }else{
        const newPermission = await Permissions.createPermission({
          role_id: roleId, 
          module_id: moduleId, 
          ...updateData, 
        });
        result.push(newPermission); 
        console.log("Permission baru telah dibuat.");
      }
      //   roleId,
      //   moduleId
      // );
      // if (existingData === undefined) {
      //   // await createPermission(update);
      //   // console.log("Permission baru telah dibuat.");
      //   // continue;
      //   console.error("undifined data");
      // }
      // const results = await Permissions.updatePermission(roleId, update);
      // result.push(results);
    }
    return res.status(200).json({
      message: "Permissions updated successfully",
      result,
    });
  } catch (error) {
    res.status(err.errorUpdate.statusCode).json({
      message: err.errorUpdate.message,
      error: error.message
    });
  }
}
async function getAllPermission(req, res) {
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
      listObj.can_create = permission.can_create;
      listObj.can_read = permission.can_read;
      listObj.can_edit = permission.can_edit;
      listObj.can_delete = permission.can_delete;
      listObj.role_id = permission.role;
      listObj.module_permission_id = permission.module;
      permissionList.push(listObj);
    }
    return res.status(200).json({
      result: permissionList,
    });
  } catch (error) {
    res.status(err.errorSelect.statusCode).json({
      message: err.errorSelect.message,
      error: error.message
    });
  }
}
async function getPermissionByRole(req, res) {
  const roleId = req.params.id;
  try {
    const result = await Permissions.getPermissionByRole(roleId);
    if (result === undefined) {
      throw new Error("No permissions found");
    }
    return res.status(200).json({
      result,
    });
  } catch (error) {
    res.status(err.errorSelect.statusCode).json({
      message: err.errorSelect.message,
      error: error.message
    });
  }
}
async function getPermissions(user) {
  try {
    const permissions = await Permissions.getPermissionByRole(user.role_id);
    if (permissions === undefined) {
      throw new Error("Permissions not found for this role");
    }
    console.log(permissions)
    return permissions;
  } catch (error) {
    res.status(err.errorSelect.statusCode).json({
      message: err.errorSelect.message,
      error: error.message
    });
  }
}
module.exports = {
  createPermission,
  updatePermission,
  getAllPermission,
  getPermissionByRole,
  getPermissions,
};
