const { dbLms } = require("../config/db/db");
const { mapMySQLError } = require("../utils/custom_error");
const { uuid } = require("../utils/tools");

const Teams = {
  createTeam: async (data, userId) => {
    try {
      const id = uuid();
      const result = await dbLms(
        `INSERT INTO teams (
            id, 
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
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          id,
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
      const result = await dbLms(
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
      const result = await dbLms(
        ` UPDATE 
            teams
          SET 
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
          data.email,
          data.profileImage,
          data.fullname,
          data.phoneNumber,
          data.address,
          data.institute,
          data.dateOfBirth,
          userId,
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
      const result = await dbLms(`DELETE FROM teams where id = ?`, [id]);
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
      const result = await dbLms(
        `SELECT 
          t.id,  
          t.email, 
          t.fullname, 
          t.role_id as roleId,  
          rt.name as role
        FROM teams t
        LEFT JOIN role_teams rt ON t.role_id = rt.id
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
      const [result] = await dbLms(
        `SELECT 
          t.id, 
          t.email, 
          t.fullname,
          t.password,
          t.role_id, 
          rt.name as role
          FROM teams t
        LEFT JOIN role_teams rt ON t.role_id = rt.id
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
      const [result] = await dbLms(
        `SELECT 
          t.id,  
          t.email, 
          t.fullname,
          t.phone_number as phoneNumber, 
          t.date_of_birth as dateOfBirth, 
          t.address, 
          t.institute, 
          t.gender_id as genderId, 
          t.role_id as roleId, 
          rt.name as role, 
          g.name as gender
          FROM teams t
        LEFT JOIN role_teams rt ON t.role_id = rt.id
        LEFT JOIN genders g ON t.gender_id = g.id
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
  getTeamByEmail: async (email) => {
    try {
      const [result] = await dbLms(
        `SELECT 
          t.id,
          t.fullname,
          t.email, 
          t.password,
          t.role_id as roleId,
          rt.name as role
        FROM teams t
        LEFT JOIN role_teams rt ON t.role_id = rt.id
        WHERE t.email = ? AND t.is_deleted = 0`,
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

  logoutTeam: async (token) => {
    try {
      const result = await dbLms(
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
      const [result] = await dbLms(
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

// softDeleteTeam: async (id, userId) => {
//   try {
//     const result = await dbLms(
//       `UPDATE
//         teams
//       SET
//         is_deleted = 1,
//         updated_at = NOW(),
//         updated_by = ?
//       WHERE id = ?`,
//       [userId, id]
//     );
//     return result;
//   } catch (error) {
//     if (error.code && error.sqlMessage) {
//       const message = mapMySQLError(error);
//       throw new Error(message);
//     }
//     throw error;
//   }
// },

// getTeamByUsernameAndEmail: async (username, email, id) => {
//   try {
//     if (id) {
//       const [result] = await dbLms(
//         `SELECT
//           id,
//           email,
//           username
//         FROM teams
//         WHERE (username LIKE ? OR email LIKE ?) AND NOT id = ? AND is_deleted = 0`,
//         [username + "%", email + "%", id]
//       );
//       return result;
//     }
//     const [result] = await dbLms(
//       `SELECT
//         id,
//         email,
//         username
//       FROM teams
//       WHERE (username LIKE ? OR email LIKE ?) AND is_deleted = 0`,
//       [username + "%", email + "%"]
//     );
//     return result;
//   } catch (error) {
//     if (error.code && error.sqlMessage) {
//       const message = mapMySQLError(error);
//       throw new Error(message);
//     }
//     throw error;
//   }
// },
