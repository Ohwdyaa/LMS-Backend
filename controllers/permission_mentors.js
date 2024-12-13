const Permissions = require("../models/permission_mentors");
const roleMentor = require("../models/role_mentors");
const Module = require("../models/module_permissions");
const { err } = require("../utils/custom_error");
const { uuid } = require("../utils/tools");

async function updatePermissionMentor(req, res) {
  const { id: userId } = req.user;
  const { id: roleId } = req.params;
  const { listModules } = req.body;
  let newValue = [];
  try {
    const isRoleExists = await roleMentor.getRoleMentorById(roleId);
    if (isRoleExists === undefined) {
      return res.status(404).json({ message: "Role not found" });
    }
    const moduleLength = listModules.length;
    for (let i = 0; i < moduleLength; i++) {
      const { moduleId, canRead, canCreate, canEdit, canDelete } =
        listModules[i];
      const isExists = await Permissions.getPermissionMentorByRoleAndModule(
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
        await Permissions.updatePermissionMentor(
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
      await Permissions.createBulkPermissionMentor(
        `INSERT INTO mentor_permissions ( 
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
      message: error.message,
      error: err.errorUpdate.message,
    });
  }
}

async function getPermissionMentorByRole(req, res) {
  const { id: roleId } = req.params;
  try {
    const permission = await Permissions.getPermissionMentorByRole(roleId);
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

async function getPermissionMentor(user) {
  try {
    const isRolePermissionsExist =
      await Permissions.getPermissionMentorByRoleJwt(user.role_id);
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
  updatePermissionMentor,
  getPermissionMentorByRole,
  getPermissionMentor,
};
