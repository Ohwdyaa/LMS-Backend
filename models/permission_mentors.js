const { formatBulkQuery1, learningManagementSystem } = require("../config/db/db");
const { mapMySQLError } = require("../utils/custom_error");

const permissionMentors = {
  getPermissionMentorByRole: async (roleId) => {
    try {
      const result = await learningManagementSystem(
        `SELECT 
              mp.can_create AS 'create', 
              mp.can_read AS 'read', 
              mp.can_edit AS 'edit', 
              mp.can_delete AS 'delete', 
              m.id AS moduleId,
              m.name AS moduleName,
              cm.name AS categoryName
          FROM learning_management_system.mentor_permissions mp
          LEFT JOIN module_pages.module m
            ON mp.module_id = m.id
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
  getPermissionMentorByRoleJwt: async (roleId) => {
    try {
      const result = await learningManagementSystem(
        `SELECT 
          mp.can_create AS 'create', 
          mp.can_read AS 'read', 
          mp.can_edit AS 'edit', 
          mp.can_delete AS 'delete', 
          m.uuid AS moduleId,
          m.name AS moduleName,
          cm.name AS categoryName
        FROM learning_management_system.mentor_permissions mp
        LEFT JOIN module_pages.module m
            ON mp.module_id = m.id
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
  getPermissionMentorByRoleAndModule: async (roleId, moduleId) => {
    try {
      const [result] = await learningManagementSystem(
        `SELECT 
          can_create AS 'create', 
          can_read AS 'read', 
          can_edit AS 'edit', 
          can_delete AS 'delete'
        FROM learning_management_system.mentor_permissions 
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
  getPermissionMentorById: async (id) => {
    try {
      const result = await learningManagementSystem(
        `SELECT 
          mp.can_create, 
          mp.can_read, 
          mp.can_edit, 
          mp.can_delete, 
          mp.role_id, r.name as role,
          mp.module_id, m.name as module
        FROM learning_management_system.mentor_permissions mp
          LEFT JOIN learning_management_system.roles r ON mp.role_id = r.id
          LEFT JOIN module_pages.module m ON mp.module_id = m.id
        WHERE mp.id = ?`,
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
  updatePermissionMentor: async (roleId, moduleId, data, userId) => {
    try {
      const result = await learningManagementSystem(
        `UPDATE mentor_permissions SET 
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
  createBulkPermissionMentor: async (query, array) => {
    const formatQuery = await formatBulkQuery1(query, array);
    await lmsManagement(formatQuery);
  },
};

module.exports = permissionMentors;
