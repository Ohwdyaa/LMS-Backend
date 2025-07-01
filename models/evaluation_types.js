const { dbMentee } = require("../config/db/db");
const { mapMySQLError } = require("../utils/custom_error");
const { uuid } = require("../utils/tools");

const contentTypes = {
  createEvaluationTypes: async (data) => {
    try {
      const id = uuid();
      const result = await dbMentee(
        `INSERT INTO types_evaluation(
          id, 
          name) 
        VALUES (?,?)`,
        [id, data.name]
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
  getAllEvalutionTypes: async () => {
    try {
      const result = await dbMentee(
        `SELECT 
          id, 
          name
        FROM types_evaluation`
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
  getEvalutionTypesById: async (id) => {
    try {
      const [result] = await dbMentee(
        `SELECT 
          id, 
          name
        FROM types_evaluation
        WHERE id = ?`, [id]
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

module.exports = contentTypes;