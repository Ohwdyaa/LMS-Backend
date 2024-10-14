const { query1 } = require("../config/db/db");
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
};
module.exports = Roles;
