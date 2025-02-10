const { dbLms } = require("../config/db/db");
const { mapMySQLError } = require("../utils/custom_error");
const { uuid } = require("../utils/tools");

const Questions = {
  createQuestion: async (data, userId) => {
    try {
      const id = uuid();
      await dbLms(
        `
        INSERT INTO questions (
            id, 
            question,
            created_by,
            quizzes_id,
            levels_id,)
        VALUES (?, ?, ?, ?, ?)`,
        [id, data.question, userId, data.quizzesId, data.levelsId]
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
module.exports = Questions;