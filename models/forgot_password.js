const { learningManagementSystem } = require("../config/db/db");
const { mapMySQLError } = require("../utils/custom_error");
const { uuid } = require("../utils/tools");

const forgetPassword = {
  createResetToken: async (userId, resetToken, expiredDate) => {
    try {
      const id = uuid();
      const result = await learningManagementSystem(
        `INSERT INTO forget_password 
          (id, 
          reset_token, 
          expired_date, 
          created_by,
          team_id) 
        VALUES (?, ?, ?, ?, ?)`,
        [id, resetToken, expiredDate, userId, userId]
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
  getResetToken: async (resetToken) => {
    try {
      const result = await learningManagementSystem(
        `SELECT 
          fp.id, 
          fp.expired_date, 
          fp.user_id, 
          u.fullname as user 
        FROM forget_password fp
        LEFT JOIN users u ON fp.user_id= u.id
        WHERE reset_token = ? AND is_used = 0`,
        [resetToken]
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
  tokenAsUsed: async (resetToken) => {
    try {
      await learningManagementSystem(
        `UPDATE 
          forget_password 
        SET 
          is_used = 1 
        WHERE reset_token = ?`,
        [resetToken]
      );
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },
  clearExpiredToken: async () => {
    try {
      await learningManagementSystem(
        `DELETE FROM forget_password WHERE expired_date < NOW() AND is_used = false`
      );
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },
};

module.exports = forgetPassword;