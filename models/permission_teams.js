const { formatBulkQuery1, lmsManagement } = require("../config/db/db");
const { mapMySQLError } = require("../utils/custom_error");

const permissionTeams = {
  getPermissionTeamByRole: async (roleId) => {
    try {
      const result = await lmsManagement(
        `SELECT 
              tp.can_create AS 'create', 
              tp.can_read AS 'read', 
              tp.can_edit AS 'edit', 
              tp.can_delete AS 'delete', 
              m.id AS moduleId,
              m.name AS moduleName,
              cm.name AS categoryName
          FROM learning_management_system.team_permissions tp
          LEFT JOIN module_pages.module m
            ON tp.module_id = m.id
          LEFT JOIN module_pages.category_module cm
            ON m.category_module_id = cm.id
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
      const result = await lmsManagement(
        `SELECT 
          tp.can_create AS 'create', 
          tp.can_read AS 'read', 
          tp.can_edit AS 'edit', 
          tp.can_delete AS 'delete', 
          m.uuid AS moduleId,
          m.name AS moduleName,
          cm.name AS categoryName
        FROM learning_management_system.team_permissions tp
        LEFT JOIN module_pages.module m 
            ON tp.module_id = m.id
        LEFT JOIN module_pages.category_module cm
            ON m.category_module_id = cm.id
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
      const [result] = await lmsManagement(
        `SELECT 
          can_create AS 'create', 
          can_read AS 'read', 
          can_edit AS 'edit', 
          can_delete AS 'delete'
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
  getPermissionTeamById: async (id) => {
    try {
      const result = await lmsManagement(
        `SELECT 
          tp.can_create, 
          tp.can_read, 
          tp.can_edit, 
          tp.can_delete, 
          tp.role_id, r.name as role,
          tp.module_id, m.name as module
        FROM learning_management_system.team_permissions tp
        LEFT JOIN learning_management_system.roles r ON tp.role_id = r.id
        LEFT JOIN module_pages.module m ON tp.module_id = m.id
        WHERE tp.id = ?`,
        [id]
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
      const result = await lmsManagement(
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
    const formatQuery = await formatBulkQuery1(query, array);
    await lmsManagement(formatQuery);
  },
};

module.exports = permissionTeams;
