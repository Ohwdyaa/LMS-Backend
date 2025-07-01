const { dbMentee } = require("../config/db/db");
const { mapMySQLError } = require("../utils/custom_error");
const { uuid } = require("../utils/tools");

const Evaluation = {
  createEvaluation: async (score, typesId, userId, quizzesId) => {
    try {
      const id = uuid();
      await dbMentee(
        `
          INSERT INTO evaluation (
              id, 
              score,
              created_by,
              type_id,
              quizzes_id,
              mentees_id)
          VALUES (?, ?, ?, ?, ?, ?)`,
        [id, score, userId, typesId, quizzesId, userId]
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
  updateEvaluation: async (score, userId, id) => {
    try {
      await dbMentee(
        `
          UPDATE 
            evaluation 
          SET 
            score = ?,
            updated_at = NOW(),
            updated_by = ? 
          WHERE id = ?`,
        [score, userId, id]
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
  getScoreById: async (id) => {
    try {
      const [result] = await dbMentee(
        `
          SELECT 
            score, 
            total_question
          FROM evaluation 
          WHERE id = ?`,
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
  getByQuizAndUser: async (quizId, menteesId) => {
    try {
      const [result] = await dbMentee(
        `
          SELECT 
            id,
            score
          FROM evaluation 
          WHERE quizzes_id = ? 
          AND mentees_id = ?`,
        [quizId, menteesId]
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
