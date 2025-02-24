const Permissions = require("../models/permission_teams");
const roleTeams = require("../models/role_teams");
const Module = require("../models/module_permissions");
const { err } = require("../utils/custom_error");
const { uuid } = require("../utils/tools");

async function updatePermissionTeam(req, res) {
  // const { id: userId } = req.user;
  const { id: roleId } = req.params;
  const { listModules } = req.body;
  let newValue = [];
  try {
    const isRoleExists = await roleTeams.getRoleTeamById(roleId);
    if (isRoleExists === undefined) {
      return res.status(404).json({ message: "Role not found" });
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
          updateData
        );
      }
      if (isExists === undefined) {
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
      await Permissions.createBulkPermissionTeam(
        `INSERT INTO team_permissions ( 
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
      message: error.message,
      error: err.errorUpdate.message,
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

        permissionList.push({
          canCreate: 0,
          canRead: 0,
          canEdit: 0,
          canDelete: 0,
          moduleId: element.id,
          moduleName: element.name,
          categoryName: element.categoryModule,
        });
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
      message: error.message,
      error: err.errorSelect.message,
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
        .status(404)
        .json({ message: "Permissions not found for this role" });
    }
    return isRolePermissionsExist;
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: error.message,
      error: err.errorSelect.message,
    });
  }
}

module.exports = {
  updatePermissionTeam,
  getPermissionTeamByRole,
  getPermissionTeams,
};
