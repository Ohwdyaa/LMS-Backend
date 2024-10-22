const { query1, formatBulkQuery1 } = require("../config/db/db");
const { uuid } = require("../utils/tools");

const Permissions = {
  createPermission: async (permissionData) => {
    try {
      const id = uuid();
      const result = await query1(
        `INSERT INTO role_permissions (id, can_create, can_read, can_edit, can_delete, role_id,  module_id)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          permissionData.can_create ? 1 : 0,
          permissionData.can_read ? 1 : 0,
          permissionData.can_edit ? 1 : 0,
          permissionData.can_delete ? 1 : 0,
          permissionData.roleId,
          permissionData.moduleId,
        ]
      );
      return result;
    } catch (error) {
      console.error("Error creating role permission: ", error);
      throw error;
    }
  },
  getPermissionByRole: async (roleId) => {
    try {
      const result = await query1(
        `SELECT lms_db2.role_permissions.can_create AS 'create', 
              lms_db2.role_permissions.can_read AS 'read', 
              lms_db2.role_permissions.can_edit AS 'edit', 
              lms_db2.role_permissions.can_delete AS 'delete', 
              lms_module.module.uuid AS moduleId,
              lms_module.module.name AS moduleName,
              lms_module.category_module.name AS categoryName
          FROM lms_db2.role_permissions 
          LEFT JOIN lms_module.module 
            ON lms_db2.role_permissions.module_id = module.id
            LEFT JOIN lms_module.category_module
            ON lms_module.module.category_module_id = category_module.id
        WHERE role_id = ?`,
        [roleId]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  getPermissionByRoleAndModule: async (roleId, moduleId) => {
    try {
      const [result] = await query1(
        `SELECT 
          can_create AS 'create', 
          can_read AS 'read', 
          can_edit AS 'edit', 
          can_delete AS 'delete'
        FROM lms_db2.role_permissions 
        WHERE role_id = ? AND module_id = ?`,
        [roleId, moduleId]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  getPermissionById: async (permissionId) => {
    try {
      const result = await query1(
        `SELECT lms_db2.role_permissions.can_create, 
          lms_db2.role_permissions.can_read, 
          lms_db2.role_permissions.can_edit, 
          lms_db2.role_permissions.can_delete, 
          lms_db2.role_permissions.role_id, lms_db2.roles.name as role,
          lms_db2.role_permissions.module_id, lms_module.module.name as module
        FROM lms_db2.role_permissions
          LEFT JOIN lms_db2.roles ON lms_db2.role_permissions.role_id = lms_db2.roles.id
          LEFT JOIN lms_module.module ON lms_db2.role_permissions.module_id = lms_module.module.id
        WHERE lms_db2.role_permissions.id = ?`,
        [permissionId]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  getAllPermission: async () => {
    try {
      const result = await query1(`
        SELECT 
          rp.id, 
          rp.can_create as 'create', 
          rp.can_read as 'read', 
          rp.can_edit as 'edit', 
          rp.can_delete as 'delete', 
          rp.role_id as roleId, r.name as role,
          rp.module_id as moduleId, m.name as module
        FROM lms_db2.role_permissions rp
        LEFT JOIN lms_db2.roles r ON rp.role_id = r.id
        LEFT JOIN lms_module.module m ON rp.module_id = m.id`);
      return result;
    } catch (error) {
      throw error;
    }
  },
  updatePermission: async (roleId, moduleId, update) => {
    try {
      const result = await query1(
        `UPDATE role_permissions SET 
        can_create = ?,
        can_read = ?, 
        can_edit = ?, 
        can_delete = ?, 
        updated_at = NOW()
        WHERE role_id = ? AND module_id = ?`,
        [
          update.canCreate,
          update.canRead,
          update.canUpdate,
          update.canDelete,
          roleId,
          moduleId,
        ]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  createBulkPermission: async (query, array) => {
    const formatQuery = await formatBulkQuery1(query, array);
    await query1(formatQuery);
  },
};
module.exports = Permissions;
