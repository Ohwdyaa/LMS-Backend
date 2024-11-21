const { lmsManagement } = require("../config/db/db");
const { mapMySQLError } = require("../utils/custom_error");
const { uuid } = require("../utils/tools");

const forgetPassword = {
  createResetToken: async (userId, resetToken, expiredDate) => {
    try {
      const id = uuid();
      const result = await lmsManagement(
        `INSERT INTO forget_password 
          (id, 
          reset_token, 
          expired_date, 
          is_used, 
          user_id) 
        VALUES (?, ?, ?, ?, ?)`,
        [id, resetToken, expiredDate, false, userId]
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
      const result = await lmsManagement(
        `SELECT 
          fp.id, 
          fp.expired_date, 
          fp.user_id, 
          u.fullname as user 
        FROM forget_password fp
        LEFT JOIN users u ON fp.user_id= u.id
        WHERE reset_token = ? AND is_used = false`,
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
      await lmsManagement(
        `UPDATE 
          forget_password 
        SET 
          is_used = true 
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
      await lmsManagement(
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