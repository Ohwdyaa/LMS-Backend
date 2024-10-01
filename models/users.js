const { query } = require("../config/db/db");
const { uuid } = require("../utils/tools");
const { err} = require("../utils/customError");

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
      throw err.dataErr;
    }
  },
  updateUser: async (userId, userData) => {
    try {
      const result = await query(`UPDATE users SET ? WHERE id = ?`, [
        userData,
        userId,
      ]);
      return result;
    } catch (error) {
      throw err.dataErr;
    }
  },
  deleteUser: async (userId) => {
    try {
      const result = await query(`DELETE FROM users WHERE id = ?`, [userId]);
      return result;
    } catch (error) {
      throw err.dataErr;
    }
  },
  getAllUser: async () => {
    try {
      const result = await query(`SELECT users.*, roles.name as role, genders.name as gender, religions.name as religion
          FROM users
          JOIN roles ON users.role_id = roles.id
          LEFT JOIN genders ON users.gender_id = genders.id
          LEFT JOIN religions ON users.religion_id = religions.id `);
      return result;
    } catch (error) {
      throw err.dataErr;
    }
  },
  getUserById: async (id) => {
    try {
      const result = await query(
        `
          SELECT users.*, roles.name as roleName, genders.name as genderName, religions.name as religionName
          FROM users
          JOIN roles ON users.role_id = roles.id
          LEFT JOIN genders ON users.gender_id = genders.id
          LEFT JOIN religions ON users.religion_id = religions.id
          WHERE users.id = ?
            `,
        [id]
      );
      if (result) {
        return result;
      }
      return null;
    } catch (error) {
      throw err.dataErr;
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
      throw err.dataErr;
    }
  },
  updateUserRole: async (userId, roleId) => {
    try {
      const result = await query("UPDATE users SET role_id= ? WHERE id = ? ", [
        roleId,
        userId,
      ]);

      return result.affectedRows > 0;
    } catch (error) {
      throw err.dataErr;
    }
  },
  // updateRefreshToken: async (userId, refreshToken) => {
  //   try {
  //     const result = await query(
  //       "UPDATE users SET refresh_token = ? WHERE id = ?",
  //       [refreshToken, userId]
  //     );

  //     return result.affectedRows > 0;
  //   } catch (error) {
  //     throw err.dataErr;
  //   }
  // },
  // getUserByRefreshToken: async (refreshToken) => {
  //   try {
  //     const result = await query(
  //       `
  //       SELECT users.id, users.username, users.email, roles.name as role 
  //       FROM users
  //       JOIN roles ON users.role_id = roles.id
  //       WHERE users.refresh_token = ?
  //       `,
  //       [refreshToken]
  //     );

  //     return result;
  //   } catch (error) {
  //     throw err.dataErr;
  //   }
  // },
  // logoutUser: async(refreshToken) => {
  //   try {
  //     const result = await query(`UPDATE users SET refresh_token = NULL WHERE refresh_token = ?`, [refreshToken]);
  //     return result.affectedRows > 0; 
  //   } catch (error) {
  //     throw err.dataErr;
  //   }
  // }
};



module.exports = Users;
