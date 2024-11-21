const { lmsManagement } = require("../config/db/db");
const { mapMySQLError } = require("../utils/custom_error");
const { uuid } = require("../utils/tools");

const Teams = {
  createTeam: async (data, userId) => {
    try {
      const id = uuid();
      const result = await lmsManagement(
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
      const result = await lmsManagement(
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
  updateTeam: async (id, data) => {
    try {
      const result = await lmsManagement(
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
          id,
          data.genderId,
          data.religionId,
          id
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
      const result = await lmsManagement(
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
  getAllTeams: async () => {
    try {
      const result = await lmsManagement(
        `SELECT 
          t.id, 
          t.username, 
          t.email, 
          t.fullname, 
          t.gender_id, 
          t.role_id, 
          t.religion_id, 
          r.name as role, 
          g.name as gender, 
          rg.name as religion
        FROM teams t
        LEFT JOIN roles r ON t.role_id = r.id
        LEFT JOIN genders g ON t.gender_id = g.id
        LEFT JOIN religions  rg ON t.religion_id = rg.id `
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
      const [result] = await lmsManagement(
        `SELECT 
          t.id,
          t.username, 
          t.email, 
          t.fullname, 
          t.role_id, r.name as role
          FROM teams t
        LEFT JOIN roles r ON t.role_id = r.id
        WHERE t.id = ?`,
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
  getTeamByEmail: async (email) => {
    try {
      const [result] = await lmsManagement(
        `SELECT 
          t.id, 
          t.username, 
          t.email, 
          t.password, 
          t.fullname, 
          t.role_id, r.name as role 
        FROM teams t
        LEFT JOIN roles r ON t.role_id = r.id WHERE email = ?`,
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
  getTeamByRole: async (id) => {
    try {
      const result = await lmsManagement(
        `SELECT 
          t.id, 
          t.username, 
          t.email, 
          t.password, 
          t.fullname, 
          r.name as role 
        FROM teams t
        LEFT JOIN roles r ON t.role_id = r.id 
        WHERE t.role_id = ?`,
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
  logoutTeam: async (token) => {
    try {
      const result = await lmsManagement(
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
};

module.exports = Teams;
