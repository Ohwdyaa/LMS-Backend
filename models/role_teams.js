const { lmsManagement } = require("../config/db/db");
const { mapMySQLError } = require("../utils/custom_error");
const { uuid } = require("../utils/tools");
const roleTeams = {
  createRoleTeam: async (data, userId) => {
    try {
      const id = uuid();
      const result = await lmsManagement(
        `INSERT INTO roles 
          (id,
          name,
          created_by) 
        VALUES (?,?,?)`,
        [id, data.name, userId]
      );
      return result;
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },
  getRoleTeamById: async (id) => {
    try {
      const [result] = await lmsManagement(
        `SELECT 
          id, 
          name 
        FROM roles 
        WHERE id = ?`,
        [id]
      );
      return result;
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },
  getAllRoleTeams: async () => {
    try {
      const result = await lmsManagement(
        `SELECT 
          id, 
          name 
        FROM roles 
        WHERE is_deleted = 0`
      );
      return result;
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },
  deleteRoleTeam: async (id) => {
    try {
      const result = await lmsManagement(`DELETE FROM roles where id = ?`, [
        id,
      ]);
      return result;
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },
  changeTeamRole: async (userId, id, newRoleId) => {
    try {
      const result = await lmsManagement(
        `UPDATE 
          teams 
        SET 
          role_id = ?, 
          updated_at = NOW(), 
          updated_by = ? 
        WHERE id = ? `,
        [newRoleId, userId, id]
      );
      return result;
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },
};

module.exports = roleTeams;
