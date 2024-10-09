const { query1, query2 } = require("../config/db/db");
const { uuid } = require("../utils/tools");

const Roles = {
  createRole: async (roleData) => {
    try {
      const id = uuid();
      const result = await query1(
        `
        INSERT INTO roles (
        id,
        name
        ) VALUES (?,?)`,
        [id, roleData.name]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  getRoleById: async (roleId) => {
    try {
      const [result] = await query1("SELECT * FROM roles WHERE id = ?", roleId);
      return result;
    } catch (error) {
      throw error;
    }
  },
  getAllRoles: async () => {
    try {
      const result = await query1("SELECT * FROM roles");
      return result;
    } catch (error) {
      throw error;
    }
  },
  deleteRole: async (roleId) => {
    try {
      const result = await query1("DELETE FROM roles where id = ? ", roleId);
      return result;
    } catch (error) {
      throw error;
    }
  },

  // role permissions
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
};
module.exports = Roles;
