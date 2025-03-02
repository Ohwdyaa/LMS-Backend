const { dbMentee } = require("../config/db/db");
const { mapMySQLError } = require("../utils/custom_error");
const { uuid } = require("../utils/tools");

const Evaluation = {
  createEvaluation: async (data, userId) => {
    try {
      const id = uuid();
      await dbMentee(
        `INSERT INTO evaluation (
            id, 
            score,
            total_question,
            created_by,
            quiz_id,
            mentee_id)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [id, data.score, data.totalQuestions, userId, data.quizId, userId]
      );
      return data.score;
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },
  updateEvaluation: async (data, userId, id) => {
    try {
      await dbMentee(
        `UPDATE 
          evaluation 
        SET 
          score = ?,
          total_question = ?,
          updated_at = NOW(),
          updated_by = ? 
        WHERE id = ?`,
        [data.score, data.totalQuestions, userId, id]
      );
      return data.score;
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },
  getByQuizAndUser: async (quizId, userId) => {
    try {
      const [result] = await dbMentee(
        `SELECT 
          id, 
          score, 
          total_question
        FROM evaluation 
        WHERE quiz_id = ? AND mentee_id = ?`,
        [quizId, userId]
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
module.exports = Evaluation;
