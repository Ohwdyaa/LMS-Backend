const { lmsManagement } = require("../config/db/db");
const { uuid } = require("../utils/tools");

const Categories = {
  createCategory: async (data, userId) => {
    try {
      const id = uuid();
      const result = await lmsManagement(
        `INSERT INTO categories
          (id, 
          name, 
          created_by) 
        VALUES (?,?,?)`,
        [id, data.name, userId]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  },
  updateCategory: async (id, data, userId) => {
    try {
      const result = await lmsManagement(
        `UPDATE 
          categories
        SET
          name = ?,
          updated_at = NOW(),
          updated_by = ?
        WHERE id =?`,
        [data.name, userId, id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  deleteCategory: async (id) => {
    try {
      const result = await lmsManagement(
        `DELETE FROM categories WHERE id = ?`,
        id
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  getByIdCategory: async (id) => {
    try {
      const [result] = await lmsManagement(
        `SELECT 
          id, 
          name 
        FROM categories 
        WHERE id = ?`,
        [id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = Categories;