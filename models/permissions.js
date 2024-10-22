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
        `SELECT 
              rp.can_create AS 'create', 
              rp.can_read AS 'read', 
              rp.can_edit AS 'edit', 
              rp.can_delete AS 'delete', 
              m.id AS moduleId,
              m.name AS moduleName,
              cm.name AS categoryName
          FROM lms_db2.role_permissions rp
          LEFT JOIN lms_module.module m
            ON rp.module_id = m.id
          LEFT JOIN lms_module.category_module cm
            ON m.category_module_id = cm.id
        WHERE role_id = ?`,
        [roleId]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  getPermissionByRoleJwt: async (roleId) => {
    try {
      const result = await query1(
        `SELECT 
          rp.can_create AS 'create', 
          rp.can_read AS 'read', 
          rp.can_edit AS 'edit', 
          rp.can_delete AS 'delete', 
          m.uuid AS moduleId,
          m.name AS moduleName,
          cm.name AS categoryName
        FROM lms_db2.role_permissions rp
        LEFT JOIN lms_module.module m
            ON rp.module_id = m.id
          LEFT JOIN lms_module.category_module cm
            ON m.category_module_id = cm.id
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
        `SELECT 
          rp.can_create, 
          rp.can_read, 
          rp.can_edit, 
          rp.can_delete, 
          rp.role_id, r.name as role,
          rp.module_id, m.name as module
        FROM lms_db2.role_permissions rp
          LEFT JOIN lms_db2.roles r ON rp.role_id = r.id
          LEFT JOIN lms_module.module m ON rp.module_id = m.id
        WHERE rp.id = ?`,
        [permissionId]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  getAllPermission: async () => {
    try {
      const result = await query1(
        `SELECT 
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
