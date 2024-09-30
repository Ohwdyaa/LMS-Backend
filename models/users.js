const { query } = require("../config/db/db");
const { uuid } = require("../utils/tools");

const Users = {
  createUser: async (userData) => {
    try {
      const id = uuid();
      const result = await query(
        `
        INSERT INTO users (
            id,
            username, 
            email,
            password,                
            profile_image, 
            fullName, 
            phone_Number, 
            address, 
            institute, 
            date_of_birth, 
            role_id, 
            gender_id, 
            religion_id
        ) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          id,
          userData.username,
          userData.email,
          userData.password,
          userData.profile_image,
          userData.fullName,
          userData.phone_Number,
          userData.address,
          userData.institute,
          userData.date_of_birth,
          userData.roleId,
          userData.genderId,
          userData.religionId,
        ]
      );
      return result.insertId;
    } catch (error) {
      throw new Error("Database error");
    }
  },
  getUserById: async (id) => {
    try {
      const [result] = await query(
        `
          SELECT users.*, roles.name as roleName, genders.name as genderName, religions.name as religionName
          FROM users
          JOIN roles ON users.role_id = roles.id
          JOIN genders ON users.gender_id = genders.id
          JOIN religions ON users.religion_id = religions.id
          WHERE users.id = ?
            `,
        [id]
      );
      if (result) {
        return result;
      }
      return null;
    } catch (error) {
      throw new Error("Database error occurred while fetching user");
    }
  },
  getUserByEmail: async (email) => {
    try {
      const [result] = await query("SELECT * FROM users WHERE email = ?", [
        email,
      ]);
      if (result.length === 0) {
        return null;
      }
      return result;
    } catch (error) {
      console.error("Database error:", error);
      throw new Error("Database error: " + error.message);
    }
  },
  updateUserRole: async (userId, newRoleId) => {
    try {
      const result = await query("UPDATE users SET role_id= ? WHERE id = ? ", [
        newRoleId,
        userId,
      ]);
  
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error("Database error while updating user role");
    }
  },
  updateRefreshToken: async (userId, refreshToken) => {
    try {
      const result = await query(
        "UPDATE users SET refresh_token = ? WHERE id = ?",
        [refreshToken, userId]
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw new Error("Database error");
    }
  },
};

module.exports = Users;
