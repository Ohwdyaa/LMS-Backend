const {
  formatBulkQuery1,
  dbLms,
} = require("../config/db/db");
const { mapMySQLError } = require("../utils/custom_error");

const permissionMentors = {
  getPermissionMentorByRole: async (roleId) => {
    try {
      const result = await dbLms(
        `SELECT 
          mp.can_create AS canCreate, 
          mp.can_read AS canRead, 
          mp.can_edit AS canEdit, 
          mp.can_delete AS canDelete,  
          m.id AS moduleId,
          m.name AS moduleName,
          cm.name AS categoryName
        FROM learning_management_system.mentor_permissions mp
        LEFT JOIN module_pages.module m ON mp.module_id = m.id
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
  getPermissionMentorByRoleJwt: async (roleId) => {
    try {
      const result = await dbLms(
        `SELECT 
          mp.can_create AS canCreate, 
          mp.can_read AS canRead, 
          mp.can_edit AS canEdit, 
          mp.can_delete AS canDelete, 
          m.uuid AS moduleId,
          m.name AS moduleName,
          cm.name AS categoryName
        FROM learning_management_system.mentor_permissions mp
        LEFT JOIN module_pages.module m ON mp.module_id = m.id
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
  getPermissionMentorByRoleAndModule: async (roleId, moduleId) => {
    try {
      const [result] = await dbLms(
        `SELECT 
          can_create AS canCreate, 
          can_read AS canRead, 
          can_edit AS canEdit, 
          can_delete AS canDelete
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
  updatePermissionMentor: async (roleId, moduleId, data, userId) => {
    try {
      const result = await dbLms(
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
    const formatQuery = formatBulkQuery1(query, array);
    await learningManagementSystem(formatQuery);
  },
};

module.exports = permissionMentors;
