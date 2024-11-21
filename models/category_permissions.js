const { lmsModule } = require("../config/db/db");
const { mapMySQLError } = require("../utils/custom_error");
const { uuid } = require("../utils/tools");

const moduleCategory = {
  createCategoryModule: async (data) => {
    try {
      const id = uuid();
      const result = await lmsModule(
        `INSERT INTO category_module(
          uuid, 
          name
        ) 
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
};

module.exports = moduleCategory;
