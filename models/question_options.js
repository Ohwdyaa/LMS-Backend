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
            description,
            is_correct,
            created_by,
            questions_id)
        VALUES (?, ?, ?, ?, ?)`,
        [id, data.description, data.isCorrect, userId, questionsId]
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
        `SELECT id, is_correct FROM question_options WHERE id = ?`,
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
  getOptionByQuestion: async (id) => {
    try {
      const result = await dbLms(
        `SELECT 
          qo.id, 
          qo.description,
          qo.is_correct,
          qo.questions_id
        FROM question_options qo
        LEFT JOIN questions q ON qo.questions_id = q.id
        WHERE qo.questions_id = ? AND qo.is_deleted = 0`,
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
  getOptionByQuestionAndCorrect: async (questionId, isCorrect) => {
    try {
      const [result] = await dbLms(
        `SELECT 
          qo.id, 
          qo.description,
          qo.is_correct,
          q.question as questions
        FROM question_options qo
        LEFT JOIN questions q ON qo.questions_id = q.id
        WHERE qo.questions_id = ? AND qo.is_correct = ?`,
        [questionId, isCorrect]
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
