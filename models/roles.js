const { query } = require("../config/db/db");
const { uuid } = require("../utils/tools");

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
      return result;
    } catch (error) {
      console.error("Error creating role:", error);
      throw new Error("Database error");
    }
  },
  getRoleById: async (roleId) => {
    try {
      const [result] = await query("SELECT * FROM roles WHERE id = ?", [
        roleId,
      ]);
      if (result) {
        return result;
      }
      return null;
    } catch (error) {
      throw new Error("Database error");
    }
  },
  getAllRoles: async () => {
    const [result] = await query("SELECT * FROM roles");
    return result;
  },
};

module.exports = Roles;
