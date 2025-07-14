const Permissions = require("../models/permission_teams");
const permService = require("../services/permission_teams");
const Roles = require("../models/role_teams");
const Module = require("../models/module_permissions");
const { err } = require("../utils/custom_error");
const { uuid } = require("../utils/tools");

async function updatePermissionTeam(req, res) {
  const { id: userId } = req.user;
  const { id: roleId } = req.params;
  const { listModules } = req.body;
  let newValue = [];
  console.error("listModules team", listModules);
  try {
    const isRoleExists = await Roles.getRoleTeamById(roleId);
    if (isRoleExists === undefined) {
      return res.status(404).json({ message: "Role not found" });
    }
    const moduleLength = listModules.length;
    for (let i = 0; i < moduleLength; i++) {
      const { moduleId, canRead, canCreate, canEdit, canDelete, inheritFlag } =
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
          inheritFlag,
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
          inheritFlag,
          userId,
          roleId,
          moduleId,
        ]);
      }
    }
    if (newValue.length > 0) {
      await Permissions.createBulkPermissionTeam(
        `INSERT INTO team_permissions ( 
          id, can_create, can_read, can_edit, can_delete, inherit_flag, created_by, role_id,  module_id
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
  try {
    const { id: roleId } = req.params;
    const permissions = await permService.getEffectivePermissionsForRole(
      roleId
    );
    return res.status(200).json({
      permissions,
    });
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: error.message,
      error: err.errorSelect.message,
    });
  }
}
async function getPermissionTeam(user) {
  try {
    const isRolePermissionsExist = await Permissions.getPermissionTeamByRoleJwt(
      user
    );
    if (isRolePermissionsExist === undefined) {
      return res
        .status(400)
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
  getPermissionTeam,
};
