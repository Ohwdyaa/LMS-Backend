const { query2 } = require("../config/db/db");
const { uuid } = require("../utils/tools");

const moduleCategory = {
  createCategory: async (categoryData) => {
    try {
      const uuidCategory = uuid();
      const result = await query2(
        `INSERT INTO category_module_permissions (
          uuid, 
          name) VALUES (?, ?)`,
        [uuidCategory, categoryData.name]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  getCategoryById: async (categoryId) => {
    
  }
};
module.exports = moduleCategory;
