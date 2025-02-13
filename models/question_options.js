const { dbLms } = require("../config/db/db");
const { mapMySQLError } = require("../utils/custom_error");
const { uuid } = require("../utils/tools");

const questionOptions = {
  createQuestionOption: async (data, userId, questionsId) => {
    try {
      const id = uuid();
      await dbLms(
        `
        INSERT INTO question_options (
            id, 
            label,
            description,
            is_correct,
            created_by,
            questions_id)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [id, data.label, data.description, data.isCorrect, userId, questionsId]
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
  getOptionById: async (id) => {
    try {
      const [result] = await dbLms(
        `
        SELECT is_correct FROM question_options WHERE id = ?`,
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
module.exports = questionOptions;
