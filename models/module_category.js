const { query2 } = require("../config/db/db");
const { uuid } = require("../utils/tools");  

const moduleCategory = {
  createCategory: async (categoryData) => {
    try {
      const uuidCategory = uuid();
      const result = await query2(
        `
            INSERT INTO category_module(
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
  updateCategory: async (categoryId, categoryData) => {
    try {
      const result = await query2(
        `UPDATE category_module
        SET name = ? WHERE id =?`,
        [categoryData, categoryId]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  getCategoryById: async (id) => {
    try {
      console.log('id', id)
      const result = await query2(`SELECT uuid, name FROM category_module WHERE id = ?`, [id]);
      return result;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = moduleCategory;
