const { dbLms } = require("../config/db/db");
const { mapMySQLError } = require("../utils/custom_error");
const { uuid } = require("../utils/tools");

const roleMentors = {
  createRoleMentor: async (data, userId) => {
    try {
      const id = uuid();
      const result = await dbLms(
        `INSERT INTO role_mentors 
          (id,
          name,
          parent_id,
          created_by) 
        VALUES (?,?,?,?)`,
        [id, data.name, data.parentId, userId]
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
  updateRoleMentor: async (roleId, data, userId) => {
    try {
      const result = await dbLms(
        `UPDATE role_mentors 
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
  getRoleMentorById: async (id) => {
    try {
      const [result] = await dbLms(
        `SELECT 
            id, 
            name,
            parent_id
        FROM role_mentors 
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
  getAllRoleMentors: async () => {
    try {
      const result = await dbLms(
        `SELECT 
            id, 
            name 
        FROM role_mentors 
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
        FROM role_mentors 
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
  deleteRoleMentor: async (id) => {
    try {
      const result = await dbLms(
        `DELETE FROM role_mentors where id = ?`,
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
  softDeleteRoleMentor: async (id, userId) => {
    try {
      const result = await dbLms(
        `UPDATE 
          role_mentors
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

module.exports = roleMentors;
