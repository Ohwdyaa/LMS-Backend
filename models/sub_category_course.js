const { query1 } = require("../config/db/db");
const { uuid } = require("../utils/tools");

const subCategories = {
  createSubCategories: async (subData) => {
    try {
      const id = uuid();
      const result = await query1(
        `INSERT INTO sub_categories (id, name, categories_id) VALUES (?,?,?)`,
        [id, subData.name, subData.categories_id]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  },
  updateSubCategories: async (subId, subData) => {
    try {
      const result = await query1(
        `UPDATE sub_categories SET name = ?, categories_id = ?`,
        [subData.name, subId]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  deleteSubCategories: async (subId) => {
    try {
      const result = await query1(
        `DELETE FROM sub_categories WHERE id = ?`,
        subId
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  getAllSubCategories: async () => {
    try {
      const result =
        await query1(`SELECT id, 
          name, 
          categories_id, categories.name as categories 
            FROM sub_categories
            LEFT JOIN categories ON sub_categories.categories_id = categories.id`);
      return result;
    } catch (error) {
      throw error;
    }
  },
  getSubCategoriesById: async (subId) => {
    try {
      const result = await query1(
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