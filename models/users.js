const { query1 } = require("../config/db/db");
const { uuid } = require("../utils/tools");

const Users = {
  createUser: async (userData) => {
    try {
      const id = uuid();
      const result = await query1(
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
          userData.fullname,
          userData.phone_number,
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
      throw error;
    }
  },
  updatePassword: async (userId, hashedPassword) => {
    try {
      const result = await query1(
        `UPDATE users SET password = ? where id = ?`,
        [hashedPassword, userId]
      );
      if (result.affectedRows === 0) {
        throw new Error("No user found with the given ID.");
    }
      return result;
    } catch (error) {
      throw error;
    }
  },
  updateUser: async (userEmail, userData) => {
    try {
      const result = await query1(
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
          updated_at = NOW() 
          WHERE email = ?`,
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
      const result = await query1(`DELETE FROM users WHERE id = ?`, userId);
      return result;
    } catch (error) {
      throw error;
    }
  },
  getAllUser: async () => {
    try {
      const result = await query1(
        `SELECT users.id, 
        users.username, 
        users.email, 
        users.fullname, 
        users.gender_id, 
        users.role_id, 
        users.religion_id, 
        roles.name as role, 
        genders.name as gender, 
        religions.name as religion
          FROM users
          LEFT JOIN roles ON users.role_id = roles.id
          LEFT JOIN genders ON users.gender_id = genders.id
          LEFT JOIN religions ON users.religion_id = religions.id `
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  getUserById: async (id) => {
    try {
      const result = await query1(
        `SELECT users.username, 
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
      console.log("req result:", email);
      const [result] = await query1(
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
  changeUserRole: async (userId, roleId) => {
    try {
      const result = await query1(`UPDATE users SET role_id= ? WHERE id = ? `, [
        roleId,
        userId,
      ]);
      return result;
    } catch (error) {
      throw error;
    }
  },
  logoutUser: async (token) => {
    try {
      const result = await query1(
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