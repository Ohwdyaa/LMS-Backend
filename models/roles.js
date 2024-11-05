const { lmsManagement } = require("../config/db/db");
const { uuid } = require("../utils/tools");
const Users = require("../models/users");

const Roles = {
  createRole: async (data, userId) => {
    try {
      const id = uuid();
      const result = await lmsManagement(
        `
        INSERT INTO roles (
        id,
        name,
        created_by
        ) VALUES (?,?,?)`,
        [id, data.name, userId]
      );
    return result;
    } catch (error) {
      throw error;
    }
  },
  getRoleById: async (roleId) => {
    try {
      const [result] = await lmsManagement("SELECT id, name FROM roles WHERE id = ?", [
        roleId,
      ]);
      return result;
    } catch (error) {
      throw error;
    }
  },
  getAllRole: async () => {
    try {
      const result = await lmsManagement(
        "SELECT id, name FROM roles WHERE is_deleted = 0"
      );

      return result;
    } catch (error) {
      throw error;
    }
  },
  deleteRole: async (roleId) => {
    try {
      const result = await lmsManagement("DELETE FROM roles where id = ? ", [roleId]);
      return result;
    } catch (error) {
      throw error;
    }
  },
  changeUserRole: async (userId, roleId) => {
    try {
      const result = await lmsManagement(`UPDATE users SET role_id = ?, updated_at = NOW() , updated_by = ? WHERE id = ? `, [
        roleId,
        userId,
        userId,
      ]);
      if (result.affectedRows === 0) {
        throw new Error('User not found');
      }
      return result;
    } catch (error) {
      throw error;
    }
  },
};
module.exports = Roles;
