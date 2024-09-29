const { query } = require("../config/db/db");

const Roles = {
  getRoleById: async (roleId) => {
    try {
      console.log(`Querying role with ID: ${roleId}`);
      const [result] = await query("SELECT * FROM roles WHERE id = ?", [
        roleId,
      ]);
      if (result) {
        return result;
      }
      console.log(`No role found with ID: ${roleId}`);
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
