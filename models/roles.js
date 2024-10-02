const { query } = require("../config/db/db");
const { uuid } = require("../utils/tools");
const { err } = require("../utils/customError");

const Roles = {
  createRole: async (roleData) => {
    try {
      const id = uuid();  
      const result = await query(
        `
        INSERT INTO roles (
        id,
        name
        ) VALUES (?,?)`,
        [id, roleData.name]
      );
      if (result.length === 0) {
        return null;
      }

      return result;
    } catch (error) {
      throw err.dataErr;
    }
  },
  getRoleById: async (roleId) => {
    try {
      const [result] = await query("SELECT * FROM roles WHERE id = ?", [
        roleId,
      ]);
      if (result.length === 0) {
        return null;
      }

      return result;
    } catch (error) {
      throw err.dataErr;
    }
  },
  getAllRoles: async () => {
    try {
      const result = await query("SELECT * FROM roles");
      if (result.length === 0) {
        return null;
      }

      return result;
    } catch (error) {
      throw err.dataErr;
    }
  },
};

module.exports = Roles;
