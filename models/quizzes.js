const { dbLms } = require("../config/db/db");
const { mapMySQLError } = require("../utils/custom_error");
const { uuid } = require("../utils/tools");

const Quizzes = {
  createQUiz: async (data, userId, subModulesId) => {
    try {
      const id = uuid();
      const result = await dbLms(
        `INSERT INTO quizzes (
            id, 
            title,
            description,
            created_by,
            sub_modules_id)
        VALUES (?, ?, ?, ?, ?)`,
        [id, data.title, data.description, userId, subModulesId]
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
  updateQuiz: async (id, data, userId) => {
    try {
      const result = await dbLms(
        `UPDATE 
          quizzes 
        SET 
          title = ?, 
          description = ?, 
          updated_at = NOW(),
          updated_by = ?
        WHERE id = ?`,
        [
          data.title,
          data.description,
          userId,
          id,
        ]
      );
      return result;
    } catch (error) {}
  },
  getQuizById: async (id) => {
    try {
      const [result] = await dbLms(
        `SELECT id, title, description FROM quizzes WHERE id = ?`,
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
  getQuizBySubModule: async (id) => {
    try {
      const [result] = await dbLms(
        `SELECT 
          q.id, 
          q.title,
          q.description,
          sm.title as subModule 
        FROM quizzes q
        LEFT JOIN sub_modules sm ON q.sub_modules_id = sm.id 
        WHERE q.sub_modules_id = ?`,
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
  }
};
module.exports = Quizzes;
