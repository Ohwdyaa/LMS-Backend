const { dbLms } = require("../config/db/db");
const { mapMySQLError } = require("../utils/custom_error");
const { uuid } = require("../utils/tools");

const subCategory = {
  createSubCategory: async (data, userId) => {
    try {
      const id = uuid();
      const result = await dbLms(
        `INSERT INTO sub_categories (
          id, 
          name, 
          created_by, 
          categories_id) 
          VALUES (?,?,?,?)`,
        [id, data.name, userId, data.categoriesId]
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
  updateSubCategory: async (id, data, userId) => {
    try {
      const result = await dbLms(
        `UPDATE 
          sub_categories 
        SET 
          name = ?, 
          updated_at = NOW(), 
          updated_by = ?
        WHERE id = ?`,
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
  deleteSubCategory: async (id) => {
    try {
      const result = await dbLms(
        `DELETE FROM sub_categories WHERE id = ?`,
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
  softDeleteSubCategory: async (id, userId) => {
    try {
      const result = await dbLms(
        `UPDATE 
          sub_categories
        SET 
          is_deleted = 1,
          updated_at = NOW(),
          updated_by = ?
        WHERE id = ?`,
        [userId, id]
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
  getAllSubCategories: async () => {
    try {
      const result = await dbLms(`
          SELECT 
            sc.id, 
            sc.name, 
            sc.categories_id, 
            c.name as categories 
          FROM sub_categories sc
          LEFT JOIN categories c ON sc.categories_id = c.id
          WHERE sc.is_deleted = 0`);
      return result;
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },
  getSubCategoryById: async (id) => {
    try {
      const [result] = await dbLms(
        `SELECT 
          sc.id, 
          sc.name, 
          sc.categories_id, 
          c.name as categories 
        FROM sub_categories sc
        LEFT JOIN categories c ON sc.categories_id = c.id
        WHERE sc.id = ? AND sc.is_deleted = 0`,
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
};

module.exports = subCategory;
