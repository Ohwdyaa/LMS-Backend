const Permissions = require("../models/permission_teams");
const roleTeams = require("../models/role_teams");
const Module = require("../models/module_permissions");
const { err } = require("../utils/custom_error");
const { uuid } = require("../utils/tools");
async function updatePermissionTeam(req, res) {
  const { id: userId } = req.user;
  const { id: roleId } = req.params;
  const { listModules } = req.body;
  let newValue = [];
  try {
    const isRoleExists = await roleTeams.getRoleTeamById(roleId);
    if (isRoleExists === undefined) {
      return res.status(400).json({ message: "Role not found" });
    }
    const moduleLength = listModules.length;
    for (let i = 0; i < moduleLength; i++) {
      const { moduleId, canRead, canCreate, canEdit, canDelete } =
        listModules[i];
      const isExists = await Permissions.getPermissionTeamByRoleAndModule(
        roleId,
        moduleId
      );
      if (isExists !== undefined) {
        const updateData = {
          canRead,
          canCreate,
          canEdit,
          canDelete,
        };
        await Permissions.updatePermissionTeam(
          roleId,
          moduleId,
          updateData,
          userId
        );
      }
      if (isExists === undefined) {
        newValue.push([
          uuid(),
          canCreate,
          canRead,
          canEdit,
          canDelete,
          userId,
          roleId,
          moduleId,
        ]);
      }
    }
    if (newValue.length > 0) {
      await Permissions.createBulkPermissionTeam(
        `INSERT INTO team_permissions ( 
          id, can_create, can_read, can_edit, can_delete, created_by, role_id,  module_id
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
async function getPermissionTeamByRole(req, res) {
  const { id: roleId } = req.params;
  try {
    const permission = await Permissions.getPermissionTeamByRole(roleId);
    if (permission.length === 0) {
      const permissionList = [];
      const modules = await Module.getAllModule();

      for (let i = 0; i < modules.length; i++) {
        const element = modules[i];

        const permissionObj = new Object();
        permissionObj.create = 0;
        permissionObj.read = 0;
        permissionObj.edit = 0;
        permissionObj.delete = 0;
        permissionObj.moduleId = element.id;
        permissionObj.moduleName = element.name;
        permissionObj.categoryName = element.categoryModule;
        permissionList.push(permissionObj);
      }

      return res.status(200).json({
        permission: permissionList,
      });
    }
    return res.status(200).json({
      permission,
    });
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: err.errorSelect.message,
      error: error.message,
    });
  }
}
async function getPermissionTeams(user) {
  try {
    const isRolePermissionsExist = await Permissions.getPermissionTeamByRoleJwt(
      user.role_id
    );
    if (isRolePermissionsExist === undefined) {
      return res
        .status(400)
        .json({ message: "Permissions not found for this role" });
    }
    return isRolePermissionsExist;
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: err.errorSelect.message,
      error: error.message,
    });
  }
}
module.exports = {
  updatePermissionTeam,
  getPermissionTeamByRole,
  getPermissionTeams,
};
