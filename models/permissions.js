const { query1, query2 } = require("../config/db/db");
const { uuid } = require("../utils/tools");

const Permissions = {
  createRolePermission: async (dataPermissions) => {
    try {
      const id = uuid();
      const result = await query1(
        `INSERT INTO role_permissions (id, can_create, can_read, can_edit, can_delete, role_id,  module_permission_id)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          dataPermissions.can_create ? 1 : 0,
          dataPermissions.can_read ? 1 : 0,
          dataPermissions.can_edit ? 1 : 0,
          dataPermissions.can_delete ? 1 : 0,
          dataPermissions.roleId,
          dataPermissions.modulePermissionId,
        ]
      );
      return result;
    } catch (error) {
      console.error("Error creating role permission: ", error);
      throw error;
    }
  },
  getPermissionsByRoleid: async (role_id) => {
    try {
      const [result] = await query1(
        `SELECT can_create, can_read, can_edit, can_delete, module_permission_id FROM role_permissions WHERE role_id = ?`,
        [role_id]
      );
      return result;
    } catch (error) {
      console.error("Error getting role permission: ", error);
      throw error;
    }
  },
  getModulePermissionsById: async (module_permission_id) => {
    try {
      console.error(" data: ", module_permission_id);
      const [result] = await query2(
        `SELECT uuid, category_module_permissions_id FROM module_permission WHERE id = ?`,
        [module_permission_id]
      );
      console.error(" data: ", result);
      return result;
    } catch (error) {
      console.error("Error getting module permission: ", error);
      throw error;
    }
  },
};
module.exports = Permissions;