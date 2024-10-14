const { query1 } = require("../config/db/db");
const { uuid } = require("../utils/tools");

const forgetPassword = {
  createResetToken: async (userId, resetToken, expiredDate) => {
    try {
      const id = uuid();
      const result = await query1(
        `INSERT INTO forget_password (id, reset_token, expired_date, is_used, user_id) VALUES (?, ?, ?, ?, ?)`,
        [id, resetToken, expiredDate, false, userId]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  getResetToken: async (resetToken) => {
    try {
      const result = await query1(
        `SELECT forget_password.id, forget_password.expired_date, forget_password.user_id, users.fullname as user 
            FROM forget_password 
            LEFT JOIN users ON forget_password.user_id = users.id
            WHERE reset_token = ? AND is_used = false`,
        [resetToken]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  tokenAsUsed: async (resetToken) => {
    try {
      await query1(
        `UPDATE forget_password SET is_used = true WHERE reset_token = ?`,
        [resetToken]
      );
    } catch (error) {
      throw error;
    }
  },
  clearExpiredToken: async () => {
    try {
      await query1(
        `DELETE FROM forget_password WHERE expired_date < NOW() AND is_used = false`
      );
    } catch (error) {
      throw error;
    }
  },
};

module.exports = forgetPassword;
