const {
  formatBulkQuery1,
  dbLms,
} = require("../config/db/db");
const { mapMySQLError } = require("../utils/custom_error");

const permissionTeams = {
  getPermissionTeamByRole: async (roleId) => {
    try {
      const result = await dbLms(
        `SELECT 
          tp.can_create AS canCreate, 
          tp.can_read AS canRead, 
          tp.can_edit AS canEdit, 
          tp.can_delete AS canDelete, 
          m.id AS moduleId,
          m.name AS moduleName,
          cm.name AS categoryName
        FROM learning_management_system.team_permissions tp
        LEFT JOIN module_pages.module m ON tp.module_id = m.id
        LEFT JOIN module_pages.category_module cm ON m.category_module_id = cm.id
        WHERE role_id = ?`,
        [roleId]
      );
      return result;
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },
  getPermissionTeamByRoleJwt: async (roleId) => {
    try {
      const result = await dbLms(
        `SELECT 
          tp.can_create AS canCreate, 
          tp.can_read AS canRead, 
          tp.can_edit AS canEdit, 
          tp.can_delete AS canDelete,  
          m.uuid AS moduleId,
          m.name AS moduleName,
          cm.name AS categoryName
        FROM learning_management_system.team_permissions tp
        LEFT JOIN module_pages.module m ON tp.module_id = m.id
        LEFT JOIN module_pages.category_module cm ON m.category_module_id = cm.id
        WHERE role_id = ?`,
        [roleId]
      );
      return result;
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },
  getPermissionTeamByRoleAndModule: async (roleId, moduleId) => {
    try {
      const [result] = await dbLms(
        `SELECT 
          can_create AS canCreate, 
          can_read AS canRead, 
          can_edit AS canEdit, 
          can_delete AS canDelete
        FROM learning_management_system.team_permissions 
        WHERE role_id = ? AND module_id = ?`,
        [roleId, moduleId]
      );
      return result;
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },
  updatePermissionTeam: async (roleId, moduleId, data, userId) => {
    try {
      const result = await dbLms(
        `UPDATE team_permissions SET 
          can_create = ?,
          can_read = ?, 
          can_edit = ?, 
          can_delete = ?,
          updated_by = ?
        WHERE role_id = ? AND module_id = ?`,
        [
          data.canCreate,
          data.canRead,
          data.canEdit,
          data.canDelete,
          userId,
          roleId,
          moduleId,
        ]
      );
      return result;
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },

  createBulkPermissionTeam: async (query, array) => {
    const formatQuery = formatBulkQuery1(query, array);
    await dbLms(formatQuery);
  },
};

module.exports = permissionTeams;
