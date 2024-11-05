const { lmsManagement } = require("../config/db/db");
const { uuid } = require("../utils/tools");
const Users = require("../models/users");

const Categories = {
  createCategories: async (userId, categoriesData) => {
    try {
      const id = uuid();
      const result = await lmsManagement(
<<<<<<< HEAD
        `INSERT INTO categories(
          id, 
          name,
          created_by
        ) 
        VALUES (?,?,?)`,
        [id, categoriesData.name, userId]
=======
        `INSERT INTO categories(id, name) 
        VALUES(?,?)`,
        [id, categoriesData.name]
>>>>>>> b52f5cf9914297a6abf9b44ac03b1d9348b39a26
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  },
  updateCategories: async ( categoriesData, userId, categories_id) => {
    try {
      const result = await lmsManagement(
        `UPDATE categories
          SET
          name = ?,
          updated_at = NOW(),
          updated_by = ?
          WHERE id =?`,
        [categoriesData.name, userId, categories_id]
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
