const Permissions = require("../models/permissions");
const Roles = require("../models/roles");
const { err } = require("../utils/customError");
const { uuid } = require("../utils/tools");

async function updatePermissions(req, res) {
  const { id: roleId } = req.params;
  const { listModules } = req.body;
  let newValue = [];
  try {
    const isRoleExists = await Roles.getRoleById(roleId);
    if (isRoleExists === undefined) {
      return res.status(400).json({ message: "Role not found" });
    }
    const moduleLength = listModules.length;
    for (let i = 0; i < moduleLength; i++) {
      const { moduleId, canRead, canCreate, canEdit, canDelete } =
        listModules[i];
      const isExists = await Permissions.getPermissionByRoleAndModule(
        roleId,
        moduleId
      );
      if (isExists !== undefined) {
        // update query for existing role and module
        const updateData = {
          canRead,
          canCreate,
          canEdit,
          canDelete,
        };
        await Permissions.updatePermission(roleId, moduleId, updateData);
      }
      if (isExists === undefined) {
        // insert new permission role and module if not exists
        newValue.push([
          uuid(),
          canCreate,
          canRead,
          canEdit,
          canDelete,
          roleId,
          moduleId,
        ]);
      }
    }
    if (newValue.length > 0) {
      // in here we do inserting bulk query
      await Permissions.createBulkPermission(
        `INSERT INTO role_permissions ( 
          id, can_create, can_read, can_edit, can_delete, role_id,  module_id
        ) VALUES ?`,
        [newValue]
      );
    }
    return res.status(200).json({
      message: "Permissions updated successfully",
    });
  } catch (error) {
    return res.status(err.errorUpdate.statusCode).json({
      message: err.errorUpdate.message,
      error: error.message,
    });
  }
}
// async function getAllPermissions(req, res) {
//   try {
//     const result = await Permissions.getAllPermission();
//     if (!result || result.length === 0) {
//       throw new Error("No permissions found");
//     }
//     const permissionList = [];
//     for (let i = 0; i < result.length; i++) {
//       const permission = result[i];
//       const listObj = new Object();
//       listObj.id = permission.id;
//       listObj.canCreate = permission.can_create;
//       listObj.canRead = permission.can_read;
//       listObj.canEdit = permission.can_edit;
//       listObj.canDelete = permission.can_delete;
//       listObj.role = permission.role;
//       listObj.module = permission.module;
//       permissionList.push(listObj);
//     }
//     return res.status(200).json({
//       result: permissionList,
//     });
//   } catch (error) {
//     return res.status(err.errorSelect.statusCode).json({
//       message: err.errorSelect.message,
//       error: error.message,
//     });
//   }
// }
// async function getPermissionByRole(req, res) {
//   const { id: roleId } = req.params;
//   try {
//     const permission = await Permissions.getPermissionByRole(roleId);
//     if (permission === undefined) {
//       throw new Error("No permissions found");
//     }
//     return res.status(200).json({
//       permission,
//     });
//   } catch (error) {
//     return res.status(err.errorSelect.statusCode).json({
//       message: err.errorSelect.message,
//       error: error.message,
//     });
//   }
// }

async function getPermissions(user) {
  try {
    const permissions = await Permissions.getPermissionByRoleJwt(user.role_id);
    if (permissions === undefined) {
      throw new Error("Permissions not found for this role");
    }
    return permissions;
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: err.errorSelect.message,
      error: error.message,
    });
  }
}
module.exports = {
  updatePermissions,
  getPermissions,
};
