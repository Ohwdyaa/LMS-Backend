const { lmsManagement } = require("../config/db/db");
const { uuid } = require("../utils/tools");

const Categories = {
  createCategories: async (categoriesData) => {
    try {
      const id = uuid();
      const result = await lmsManagement(
        `INSERT INTO categories(id, name) 
        VALUES(?,?)`,
        [id, categoriesData.name]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  updateCategories: async (categoriesId, categoriesData) => {
    try {
      const result = await lmsManagement(
        `UPDATE categories
          SET
          name = ?,
          updated_at = NOW()
          WHERE id =?`,
        [categoriesData.name, categoriesId]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  deleteCategories: async (categoriesId) => {
    try {
      const result = await lmsManagement(`DELETE FROM categories WHERE id = ?`, categoriesId);
      return result;
    } catch (error) {
      throw error;
    }
  }
};
module.exports = Categories;
