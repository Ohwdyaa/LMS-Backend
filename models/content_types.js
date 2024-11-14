const { lmsManagement } = require("../config/db/db");
const { uuid } = require("../utils/tools");

const contentTypes = {
  createContentTypes: async (data) => {
    try {
      const id = uuid();
      const result = await lmsManagement(
        `INSERT INTO content_types(
          id, 
          name, 
          description) 
        VALUES (?,?,?)`,
        [id, data.name, data.description]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  },
  getAllContentTypes: async () => {
    try {
      const result = await lmsManagement(
        `SELECT 
          id, 
          name,
          description
        FROM content_types`
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = contentTypes;