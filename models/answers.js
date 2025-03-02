const { dbLms } = require("../config/db/db");
const { mapMySQLError } = require("../utils/custom_error");
const { uuid } = require("../utils/tools");

const Answers = {
  createAnswers: async (
    quizId,
    questionId,
    questionOptionId,
    isCorrect,
    userId
  ) => {
    try {
      const id = uuid();
      await dbLms(
        `INSERT INTO answers (
          id, 
          is_correct,
          created_by,
          quizzes_id,
          questions_id,
          question_options_id,
          mentees_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id, isCorrect, userId, quizId, questionId, questionOptionId, userId]
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
  getByQuizAndUser: async (quizId, userId) => {
    try {
      const result = await dbLms(
        `SELECT 
          a.id, 
          a.is_correct, 
          a.questions_id as questionId,
          q.question as question, 
          qo.description as question_option
        FROM answers a
        LEFT JOIN questions q ON a.questions_id = q.id
        LEFT JOIN question_options qo ON a.question_options_id = qo.id
        WHERE a.quizzes_id = ? AND a.mentees_id = ?`,
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
module.exports = Answers;
