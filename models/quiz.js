const { dbLms } = require("../config/db/db");
const { mapMySQLError } = require("../utils/custom_error");
const { uuid } = require("../utils/tools");

const Quizzes = {
  createQUiz: async (data, userId) => {
    try {
      const id = uuid();
      await dbLms(
        `
        INSERT INTO quizzes (
            id, 
            title,
            description,
            created_by,
            sub_modules_id)
        VALUES (?, ?, ?, ?, ?)`,
        [id, data.title, data.description, userId, data.subModulesId]
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
};
module.exports = Quizzes;