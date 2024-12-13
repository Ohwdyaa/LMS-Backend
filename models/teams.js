const { learningManagementSystem } = require("../config/db/db");
const { mapMySQLError } = require("../utils/custom_error");
const { uuid } = require("../utils/tools");

const Teams = {
  createTeam: async (data, userId) => {
    try {
      const id = uuid();
      const result = await learningManagementSystem(
        `INSERT INTO teams (
            id,
            username, 
            email,
            password,                
            profile_image, 
            fullname, 
            phone_number, 
            address, 
            institute, 
            date_of_birth, 
            created_by,
            role_id, 
            gender_id, 
            religion_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          id,
          data.username,
          data.email,
          data.password,
          data.profileImage,
          data.fullname,
          data.phoneNumber,
          data.address,
          data.institute,
          data.dateOfBirth,
          userId,
          data.roleId,
          data.genderId,
          data.religionId,
        ]
      );
      return result.insertId;
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },
  updatePassword: async (id, hashedPassword) => {
    try {
      const result = await learningManagementSystem(
        `UPDATE 
          teams 
        SET 
          password = ?,
          updated_at = NOW(),
          updated_by = ? 
        WHERE id = ?`,
        [hashedPassword, id, id]
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
  updateTeam: async (id, data, userId) => {
    try {
      const result = await learningManagementSystem(
        ` UPDATE 
            teams
          SET 
            username = ?,
            email = ?,                
            profile_image = ?, 
            fullname = ?, 
            phone_number = ?, 
            address = ?, 
            institute = ?, 
            date_of_birth = ?,
            updated_at = NOW(), 
            updated_by = ?,
            role_id = ?,
            gender_id = ?, 
            religion_id = ?
          WHERE id = ?`,
        [
          data.username,
          data.email,
          data.profileImage,
          data.fullname,
          data.phoneNumber,
          data.address,
          data.institute,
          data.dateOfBirth,
          userId,
          data.roleId,
          data.genderId,
          data.religionId,
          id,
        ]
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
  deleteTeam: async (id) => {
    try {
      const result = await learningManagementSystem(
        `DELETE FROM teams where id = ?`,
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
  softDeleteTeam: async (id, userId) => {
    try {
      const result = await learningManagementSystem(
        `UPDATE 
          teams 
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
  getAllTeams: async () => {
    try {
      const result = await learningManagementSystem(
        `SELECT 
          t.id, 
          t.username, 
          t.email, 
          t.fullname, 
          t.role_id as roleId,  
          r.name as role
        FROM teams t
        LEFT JOIN roles r ON t.role_id = r.id
        WHERE t.is_deleted = 0`
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
  getTeamById: async (id) => {
    try {
      const [result] = await learningManagementSystem(
        `SELECT 
          t.id,
          t.username, 
          t.email, 
          t.password,
          t.fullname, 
          t.role_id, r.name as role
          FROM teams t
        LEFT JOIN roles r ON t.role_id = r.id
        WHERE t.id = ? AND t.is_deleted = 0`,
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
  getTeamDetails: async (id) => {
    try {
      const [result] = await learningManagementSystem(
        `SELECT 
          t.id, 
          t.username, 
          t.email, 
          t.fullname,
          t.phone_number as phoneNumber, 
          t.date_of_birth as dateOfBirth, 
          t.address, 
          t.institute, 
          t.gender_id as genderId, 
          t.role_id as roleId, 
          r.name as role, 
          g.name as gender
          FROM teams t
        LEFT JOIN roles r ON t.role_id = r.id
        LEFT JOIN genders g ON t.gender_id = g.id
        WHERE t.id = ? AND t.is_deleted = 0`,
        [id]
      );
      console.log({ result });
      return result;
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },
  getTeamByEmail: async (email) => {
    try {
      const [result] = await learningManagementSystem(
        `SELECT 
          id, 
          username, 
          email, 
          password, 
          fullname, 
          role_id
        FROM teams
        WHERE email = ? AND is_deleted = 0`,
        [email]
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
  getTeamByUsernameAndEmail: async (username, email, id) => {
    try {
      if (id) {
        const [result] = await learningManagementSystem(
          `SELECT 
            id,
            email,
            username
          FROM teams
          WHERE (username LIKE ? OR email LIKE ?) AND NOT id = ? AND is_deleted = 0`,
          [username + "%", email + "%", id]
        );
        return result;
      }
      const [result] = await learningManagementSystem(
        `SELECT 
          id,
          email,
          username
        FROM teams
        WHERE (username LIKE ? OR email LIKE ?) AND is_deleted = 0`,
        [username + "%", email + "%"]
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
  logoutTeam: async (token) => {
    try {
      const result = await learningManagementSystem(
        `UPDATE teams SET refresh_token = NULL WHERE refresh_token = ?`,
        token
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
  getTeamsCountByRoleId: async (roleId) => {
    try {
      const [result] = await learningManagementSystem(
        `SELECT COUNT(*) as count FROM teams where role_id = ? AND is_deleted = 0`,
        [roleId]
      );
      return result.count;
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },
};

module.exports = Teams;
