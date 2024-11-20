const { lmsModule } = require("../config/db/db");
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
      throw error;
    }
  },
};

module.exports = moduleCategory;