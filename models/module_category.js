const { query2 } = require("../config/db/db");
const { uuid } = require("../utils/tools");

const moduleCategory = {
  createCategory: async (data) => {
    try {
      const id = uuid();
      const result = await query2(
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
  updateCategory: async (categoryId, newValue) => {
    try {
      const result = await query2(
        `UPDATE category_module
        SET name = ? WHERE id =?`,
        [newValue.name, categoryId]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  getCategoryById: async (id) => {
    try {
      const result = await query2(`SELECT uuid, name FROM category_module WHERE id = ?`, [id]);
      return result;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = moduleCategory;