const Permissions = require("../models/permissions");
const Module = require("../models/module_permission");
const { err } = require("../utils/customError");

const Roles = require("../controllers/roles");

// async function createPermission(req, res) {
//   try {
//     const allModule = await Module.getAllModule();

//     for (let i = 0; i < allModule.length; i++) {
//       const module = allModule[i];
//       await Permissions.createPermission({
//         can_create: 0,
//         can_read: 0,
//         can_edit: 0,
//         can_delete: 0,
//         roleId: roleId,
//         modulePermissionId: module.id,
//       });
//     }
//   } catch (error) {
//     throw error;
//   }
// }
async function updatePermission(req, res) {
  const { roleId, listModules   } = req.body;
  
  const result = [];

  try {
    const isRoleExists = await Roles.findRoleById(roleId);

    console.log(isRoleExists);

    // console.log(permissions);

    for (let i = 0; i < permissions.length; i++) {
      // const { moduleId, update } = permissions[i];
      // const existingData = await Permissions.getPermissionByRoleAndModule(
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
    return result;
  } catch (error) {
    throw error;
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
    return res.status(error.statusCode || 500).json({
      message: error.message || "An error occurred while retrieving permissions.",
      details: error.details || null,
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
    return res.status(error.statusCode || err.errorUpdate.statusCode).json({
      message: error.message || err.errorUpdate.message,
      details: error.details || null,
    });
  }
}
async function getPermissions(req, res) {
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
  updatePermission,
  getAllPermission,
  getPermissionByRole,
  getPermissions,
};
