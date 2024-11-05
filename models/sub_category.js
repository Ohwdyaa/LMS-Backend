const { lmsManagement } = require("../config/db/db");
const { uuid } = require("../utils/tools");

const subCategories = {
  createSubCategory: async (subData, userId) => {
    try {
      const id = uuid();
      const result = await lmsManagement(
        `INSERT INTO sub_categories (id, name, created_by, category_id) VALUES (?,?,?)`,
        [id, subData.name, userId, subData.categoriesId]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  },
  updateSubCategory: async (subId, subData, userId) => {
    try {
      const result = await lmsManagement(
        `UPDATE sub_categories SET name = ?, updated_by, categories_id = ?`,
        [subData.name, subId, userId]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  deleteSubCategory: async (subId) => {
    try {
      const result = await lmsManagement(
        `DELETE FROM sub_categories WHERE id = ?`,
        subId
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  getAllSubCategory: async () => {
    try {
      const result =
        await lmsManagement(`SELECT id, 
          name, 
          categories_id, categories.name as categories 
            FROM sub_categories
            LEFT JOIN categories ON sub_categories.categories_id = categories.id`);
      return result;
    } catch (error) {
      throw error;
    }
  },
  getSubCategoryById: async (subId) => {
    try {
      const result = await lmsManagement(
        `SELECT id, 
        name, 
        categories_id, categories.name as categories 
            FROM sub_categories
            LEFT JOIN categories ON sub_categories.categories_id = categories.id
            WHERE sub_categories.id =?`,
        [subId]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
};
module.exports = subCategories;