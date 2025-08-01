const { dbLms } = require("../config/db/db");
const { mapMySQLError } = require("../utils/custom_error");

const { uuid } = require("../utils/tools");
const roleTeams = {
  createRoleTeam: async (data, userId) => {
    try {
      const id = uuid();
      await dbLms(
        `INSERT INTO role_teams 
          (id,
          name,
          created_by,
          parent_id) 
        VALUES (?,?,?,?)`,
        [id, data.name, userId, data.parentId]
      );
      return id;
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },
  updateRoleTeam: async (roleId, data, userId) => {
    try {
      const result = await dbLms(
        `UPDATE role_teams 
        SET 
          name = ?, 
          parent_id = ?,
          updated_at = NOW(),
          updated_by = ?
        WHERE id = ?`,
        [data.name, data.parentId, userId, roleId]
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
      const [result] = await dbLms(
        `SELECT 
          id, 
          name,
          parent_id 
        FROM role_teams 
        WHERE id = ? AND is_deleted = 0`,
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
      const result = await dbLms(
        `SELECT 
          id, 
          name 
        FROM role_teams 
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
  getAllRolesForHierarchy: async () => {
    try {
      const result = await dbLms(
        `SELECT 
          id, 
          name, 
          parent_id as parent
        FROM role_teams 
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
      const result = await dbLms(`DELETE FROM role_teams where id = ?`, [id]);
      return result;
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },
  softDeleteRoleTeam: async (id, userId) => {
    try {
      const result = await dbLms(
        `UPDATE role_teams 
        SET 
          is_deleted = 1, 
          updated_at = NOW(),
          updated_by = ?
        WHERE id = ?`,
        [userId, id]
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
