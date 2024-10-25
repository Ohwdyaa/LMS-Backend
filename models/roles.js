const { query1 } = require("../config/db/db");
const { uuid } = require("../utils/tools");

const Roles = {
  createRole: async (data) => {
    try {
      const id = uuid();
      const result = await query1(
        `
        INSERT INTO roles (
        id,
        name
        ) VALUES (?,?)`,
        [id, data.name]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  getRoleById: async (roleId) => {
    try {
      const [result] = await query1("SELECT name FROM roles WHERE id = ?", [
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
        "SELECT id, name FROM roles WHERE is_deleted = 0;"
      );

      return result;
    } catch (error) {
      throw error;
    }
  },
  updateRole: async (roleId, updateData) => {
    try {
      const result = await query1("UPDATE roles SET ? WHERE id = ?", [
        updateData,
        roleId,
      ]);
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
};
module.exports = Roles;
