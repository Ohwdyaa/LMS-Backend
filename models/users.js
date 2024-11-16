const { lmsManagement } = require("../config/db/db");
const { uuid } = require("../utils/tools");

const Users = {
  createUser: async (data, userId) => {
    try {
      const id = uuid();
      const result = await lmsManagement(
        `
        INSERT INTO teams (
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
      throw error;
    }
  },
  updatePassword: async (id, hashedPassword) => {
    try {
      const result = await lmsManagement(
        `UPDATE teams SET password = ? where id = ?`,
        [hashedPassword, id]
      );
      return result;
    } catch (error) {
     error;
    }
  },
  updateUser: async (id, data) => {
    try {
      const result = await lmsManagement(
        ` UPDATE 
            teams
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
          data.username,
          data.profileImage,
          data.phoneNumber,
          data.address,
          data.institute,
          data.dateOfBirth,
          data.genderId,
          data.religionId,
          id,
          id,
        ]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  deleteUser: async (id) => {
    try {
      const result = await lmsManagement(
        `DELETE FROM teams WHERE id = ?`,
        id
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
          FROM teams u
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
          FROM teams u
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
        FROM teams u
        LEFT JOIN roles r ON u.role_id = r.id WHERE email = ?`,
        [email]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  getUserByRole: async (id) => {
    try {
      const result = await lmsManagement(
        `SELECT 
          u.id, 
          u.username, 
          u.email, 
          u.password, 
          u.fullname, 
          r.name as role 
        FROM teams u
        LEFT JOIN roles r ON u.role_id = r.id 
        WHERE u.role_id = ?`,
        [id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  logoutUser: async (token) => {
    try {
      const result = await lmsManagement(
        `UPDATE teams SET refresh_token = NULL WHERE refresh_token = ?`,
        token
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = Users;