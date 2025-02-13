const { dbLms } = require("../config/db/db");
const { mapMySQLError } = require("../utils/custom_error");
const { uuid } = require("../utils/tools");

const Answers = {
  createAnswers: async (data, isCorrect, userId) => {
    try {
      const id = uuid();
      await dbLms(
        `
        INSERT INTO answers (
            id, 
            is_correct,
            created_by,
            quizzes_id,
            question_id,
            question_options_id)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [id, isCorrect, userId, data.quizzesId, data.questionId, data.questionOptionId]
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
};
module.exports = Answers;