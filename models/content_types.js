const { learningManagementSystem } = require("../config/db/db");
const { mapMySQLError } = require("../utils/custom_error");
const { uuid } = require("../utils/tools");

const contentTypes = {
  createContentTypes: async (data) => {
    try {
      const id = uuid();
      const result = await learningManagementSystem(
        `INSERT INTO content_types(
          id, 
          name, 
          description) 
        VALUES (?,?,?)`,
        [id, data.name, data.description]
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
  getAllContentTypes: async () => {
    try {
      const result = await learningManagementSystem(
        `SELECT 
          id, 
          name,
          description
        FROM content_types`
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