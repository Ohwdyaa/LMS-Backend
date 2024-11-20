const { lmsManagement } = require("../config/db/db");
const { uuid } = require("../utils/tools");

const Roles = {
  createRole: async (data, userId) => {
    try {
      const id = uuid();
      const result = await lmsManagement(
        `
        INSERT INTO roles 
          (id,
          name,
          created_by) 
        VALUES (?,?,?)`,
        [id, data.name, userId]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  getRoleById: async (id) => {
    try {
      const [result] = await lmsManagement(
        "SELECT id, name FROM roles WHERE id = ?",
        [id]
      );
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
  deleteRole: async (id) => {
    try {
      const result = await lmsManagement("DELETE FROM roles where id = ? ", 
        [id]);
      return result;
    } catch (error) {
      throw error;
    }
  },
  changeUserRole: async (userId, id) => {
    try {
      const result = await lmsManagement(
        `UPDATE 
          teams 
        SET 
          role_id = ?, 
          updated_at = NOW(), 
          updated_by = ? 
        WHERE id = ? `,
        [id, userId, userId]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = Roles;