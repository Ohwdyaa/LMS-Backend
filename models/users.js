const { lmsManagement } = require("../config/db/db");
const { uuid } = require("../utils/tools");

const Users = {
  createUser: async (userData, id) => {
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
          userData.profileImage,
          userData.fullname,
          userData.phoneNumber,
          userData.address,
          userData.institute,
          userData.dateOfBirth,
          id,
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
      return result;
    } catch (error) {
      throw error;
    }
  },
  updateUser: async (userId, userData) => {
    try {
      const result = await lmsManagement(
        ` UPDATE 
            users
          SET 
            username = ?,
            profile_image = ?,
            phone_number = ?,
            address = ?,
            institute = ?,
            date_of_birth = ?,
            gender_id = ?,
            religion_id = ?,
            updated_at = NOW() 
          WHERE id = ?`,
        [
          userData.username,
          userData.profileImage,
          userData.phoneNumber,
          userData.address,
          userData.institute,
          userData.dateOfBirth,
          userData.genderId,
          userData.religionId,
          userId,
        ]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  deleteUser: async (userId) => {
    try {
      const result = await lmsManagement(
        `DELETE FROM users WHERE id = ?`,
        userId
      );
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
          u.id,
          u.username, 
          u.email, 
          u.fullname, 
          u.role_id, r.name as role
          FROM users u
        LEFT JOIN roles r ON u.role_id = r.id
        WHERE u.id = ?`,
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
        `SELECT 
          u.id, 
          u.username, 
          u.email, 
          u.password, 
          u.fullname, 
          u.role_id, r.name as role 
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.id WHERE email = ?`,
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
