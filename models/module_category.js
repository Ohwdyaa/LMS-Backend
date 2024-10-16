const { query2 } = require("../config/db/db");
const { uuid } = require("../utils/tools");

const moduleCategory = {
  createCategory: async (categoryData) => {
    try {
      const uuidCategory = uuid();
      const result = await query2(
        `
            INSERT INTO category_module_permissions (
                uuid, 
                name,
                created_by
            ) 
                VALUES (?, ?, ?)
            `,
        [uuidCategory, categoryData.name, "1"]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
};
module.exports = moduleCategory;
