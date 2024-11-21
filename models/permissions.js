const { formatBulkQuery1, lmsManagement } = require("../config/db/db");
const { mapMySQLError } = require("../utils/custom_error");

const Permissions = {
  getPermissionByRole: async (roleId) => {
    try {
      const result = await lmsManagement(
        `SELECT 
              rp.can_create AS 'create', 
              rp.can_read AS 'read', 
              rp.can_edit AS 'edit', 
              rp.can_delete AS 'delete', 
              m.id AS moduleId,
              m.name AS moduleName,
              cm.name AS categoryName
          FROM lms_management.role_permissions rp
          LEFT JOIN lms_module.module m
            ON rp.module_id = m.id
          LEFT JOIN lms_module.category_module cm
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
  getPermissionByRoleJwt: async (roleId) => {
    try {
      const result = await lmsManagement(
        `SELECT 
          rp.can_create AS 'create', 
          rp.can_read AS 'read', 
          rp.can_edit AS 'edit', 
          rp.can_delete AS 'delete', 
          m.uuid AS moduleId,
          m.name AS moduleName,
          cm.name AS categoryName
        FROM lms_management.role_permissions rp
        LEFT JOIN lms_module.module m
            ON rp.module_id = m.id
          LEFT JOIN lms_module.category_module cm
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
  getPermissionByRoleAndModule: async (roleId, moduleId) => {
    try {
      const [result] = await lmsManagement(
        `SELECT 
          can_create AS 'create', 
          can_read AS 'read', 
          can_edit AS 'edit', 
          can_delete AS 'delete'
        FROM lms_management.role_permissions 
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
  getPermissionById: async (id) => {
    try {
      const result = await lmsManagement(
        `SELECT 
          rp.can_create, 
          rp.can_read, 
          rp.can_edit, 
          rp.can_delete, 
          rp.role_id, r.name as role,
          rp.module_id, m.name as module
        FROM lms_management.role_permissions rp
          LEFT JOIN lms_db2.roles r ON rp.role_id = r.id
          LEFT JOIN lms_module.module m ON rp.module_id = m.id
        WHERE rp.id = ?`,
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
  updatePermission: async (roleId, moduleId, data, userId) => {
    try {
      const result = await lmsManagement(
        `UPDATE role_permissions SET 
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

  createBulkPermission: async (query, array) => {
    const formatQuery = await formatBulkQuery1(query, array);
    await lmsManagement(formatQuery);
  },
};

module.exports = Permissions;
