const { lmsModule } = require("../config/db/db");
const { uuid } = require("../utils/tools");

const moduleCategory = {
  createCategory: async (data) => {
    try {
      const id = uuid();
      const result = await lmsModule(
        `INSERT INTO category_module(
          uuid, 
          name
        ) 
        VALUES (?, ?)`,
        [id, data.name]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = moduleCategory;