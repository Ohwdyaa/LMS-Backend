const { learningManagementSystem } = require("../config/db/db");
const { mapMySQLError } = require("../utils/custom_error");
const { uuid } = require("../utils/tools");

const Categories = {
  createCategory: async (data, userId) => {
    try {
      const id = uuid();
      const result = await learningManagementSystem(
        `INSERT INTO categories
          (id, 
          name, 
          created_by) 
        VALUES (?,?,?)`,
        [id, data.name, userId]
      );
      return result.insertId;
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },
  updateCategory: async (id, data, userId) => {
    try {
      const result = await learningManagementSystem(
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
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },
  deleteCategory: async (id) => {
    try {
      const result = await learningManagementSystem(
        `DELETE FROM categories WHERE id = ?`,
        id
      );
      return result;
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },
  getCategoryById: async (id) => {
    try {
      const [result] = await learningManagementSystem(
        `SELECT 
          id, 
          name 
        FROM categories 
        WHERE id = ?`,
        [id]
      );
      return result;
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },
  getAllCategories: async () => {
    try {
      const result = await learningManagementSystem(`
          SELECT 
            id, 
            name 
          FROM categories 
          WHERE is_deleted = 0`);
      return result;
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },
};

module.exports = Categories;
