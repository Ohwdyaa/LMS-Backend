const { query1 } = require("../config/db/db");
const { uuid } = require("../utils/tools");

const Roles = {
  createRole: async (data, createdByEmail) => {
    try {
      const [creator] = await query1("SELECT id, username FROM users WHERE email = ?", [createdByEmail]);
      if (!creator) throw new Error("Creator not found");

      const id = uuid();
      const result = await query1(
        `
        INSERT INTO roles (
        id,
        name,
        created_by
        ) VALUES (?,?,?)`,
        [id, data.name, creator.id]
      );

      if (result.affectedRows === 0) {
        throw new Error("Role not created, check your input data");
      } return {
        userId: id,
        createdById: creator.id,
        createdByUsername: creator.username,
      };
    } catch (error) {
      throw error;
    }
  },
  getRoleById: async (roleId) => {
    try {
      const [result] = await query1("SELECT id, name FROM roles WHERE id = ?", [
        roleId,
      ]);
      return result;
    } catch (error) {
      throw error;
    }
  },
  getAllRole: async () => {
    try {
      const result = await query1(
        "SELECT id, name FROM roles WHERE is_deleted = 0"
      );

      return result;
    } catch (error) {
      throw error;
    }
  },
  deleteRole: async (roleId) => {
    try {
      const result = await query1("DELETE FROM roles where id = ? ", [roleId]);
      return result;
    } catch (error) {
      throw error;
    }
  },
  changeUserRole: async (userId, roleId) => {
    try {
      const result = await query1(`UPDATE users SET role_id = ? WHERE id = ? `, [
        roleId,
        userId,
      ]);
      return result;
    } catch (error) {
      throw error;
    }
  },
};
module.exports = Roles;
