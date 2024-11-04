const { lmsManagement } = require("../config/db/db");
const { uuid } = require("../utils/tools");

const Users = {
  createUser: async (userData, userId) => {
    try {
      const id = uuid();
      const result = await lmsManagement(
        `
        INSERT INTO users (
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
            religion_id
        ) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          id,
          userData.username,
          userData.email,
          userData.password,
          userData.profile_image,
          userData.fullname,
          userData.phone_number,
          userData.address,
          userData.institute,
          userData.date_of_birth,
          userId,
          userData.roleId,
          userData.genderId,
          userData.religionId,
        ]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  },
  updatePassword: async (userId, hashedPassword) => {
    try {
      const result = await lmsManagement(
        `UPDATE users SET password = ? where id = ?`,
        [hashedPassword, userId]
      );
      if (result.affectedRows === 0) {
        throw new Error("No user found with the given ID.");
      }
      return result;
    } catch (error) {
     error;
    }
  },
  updateUser: async (userId, userData) => {
    try {
      const result = await lmsManagement(
        `UPDATE users
          SET 
          username = ?,
          profile_image = ?,
          phone_number = ?,
          address = ?,
          institute = ?,
          date_of_birth = ?,
          gender_id = ?,
          religion_id = ?,
          updated_by = ?,
          updated_at = NOW() 
          WHERE id = ?`,
        [
          userData.username,
          userData.profile_image,
          userData.phone_number,
          userData.address,
          userData.institute,
          userData.date_of_birth,
          userData.genderId,
          userData.religionId,
          userEmail,
        ]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  deleteUser: async (userId) => {
    try {
      const result = await lmsManagement(`DELETE FROM users WHERE id = ?`, userId);
      return result;
    } catch (error) {
      throw error;
    }
  },
  getAllUser: async () => {
    try {
      const result = await lmsManagement(
        `SELECT u.id, 
        u.username, 
        u.email, 
        u.fullname, 
        u.gender_id, 
        u.role_id, 
        u.religion_id, 
        r.name as role, 
        g.name as gender, 
        rg.name as religion
          FROM users u
          LEFT JOIN roles r ON u.role_id = r.id
          LEFT JOIN genders g ON u.gender_id = g.id
          LEFT JOIN religions  rg ON u.religion_id = rg.id `
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  getUserById: async (id) => {
    try {
      const [result] = await lmsManagement(
        `SELECT 
        users.id,
        users.username, 
          users.email, 
          users.fullname, 
          users.role_id, roles.name as role
          FROM users
          LEFT JOIN roles ON users.role_id = roles.id
          WHERE users.id = ?`,
        [id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  getUserByEmail: async (email) => {
    try {
      const [result] = await lmsManagement(
        `SELECT users.id, 
        users.username, 
        users.email, 
        users.password, 
        users.fullname, 
        users.role_id, roles.name as role 
        FROM users 
        LEFT JOIN roles ON users.role_id = roles.id WHERE email = ?`,
        [email]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },

  logoutUser: async (token) => {
    try {
      const result = await lmsManagement(
        `UPDATE users SET refresh_token = NULL WHERE refresh_token = ?`,
        token
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = Users;
