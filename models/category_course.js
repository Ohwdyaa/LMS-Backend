const { lmsManagement } = require("../config/db/db");
const { uuid } = require("../utils/tools");
const Users = require("../models/users");

const Categories = {
  createCategories: async (categoriesData, userId) => {
    try {
      const id = uuid();
      const result = await lmsManagement(
        `INSERT INTO categories(id, name, created_by) 
        VALUES(?,?,?)`,
        [id, categoriesData.name, userId]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  },
  updateCategories: async ( categoriesId, categoriesData, userId) => {
    try {
      const result = await lmsManagement(
        `UPDATE categories
          SET
          name = ?,
          updated_at = NOW(),
          updated_by = ?
          WHERE id =?`,
        [categoriesData.name, userId, categoriesId]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  deleteCategory: async (categoriesId) => {
    try {
      const result = await lmsManagement(`DELETE FROM categories WHERE id = ?`, categoriesId);
      return result;
    } catch (error) {
      throw error;
    }
  }
};
module.exports = Categories;
