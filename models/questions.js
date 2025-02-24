const { dbLms } = require("../config/db/db");
const { mapMySQLError } = require("../utils/custom_error");
const { uuid } = require("../utils/tools");

const Questions = {
  createQuestion: async (question, quizzesId, levelsId, userId) => {
    try {
      const id = uuid();
      await dbLms(
        `
        INSERT INTO questions (
            id, 
            question,
            created_by,
            quizzes_id,
            levels_id)
        VALUES (?, ?, ?, ?, ?)`,
        [id, question, userId, quizzesId, levelsId]
      );
      return id;
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },
  updateQuestion: async (id, data, userId) => {
    try {
      const result = await dbLms(
        `UPDATE 
          questions 
        SET 
          question = ?, 
          updated_at = NOW(),
          updated_by = ?
        WHERE id = ?`,
        [
          data.question,
          userId,
          id,
        ]
      );
      return result;
    } catch (error) {}
  },
  getQuestionById: async (id) => {
    try {
      const [result] = await dbLms(
        `SELECT id, question FROM questions WHERE id = ?`,
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
  getQuestionByQuiz: async (id) => {
    try {
      const result = await dbLms(
        `SELECT 
          q.id, 
          q.question,
          l.name as level_name
        FROM questions q
        LEFT JOIN levels l ON q.levels_id = l.id
        WHERE quizzes_id = ?`,
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
};
module.exports = Questions;
