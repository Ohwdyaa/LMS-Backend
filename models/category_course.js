const { query1 } = require("../config/db/db");
const { uuid } = require("../utils/tools");

const Categories = {
  createCategories: async (categoriesData, createdByEmail) => {
    try {
      const [creator] = await query1("SELECT id, username FROM users WHERE email = ?", [createdByEmail]);
      if (!creator) throw new Error("Creator not found");

      const id = uuid();
      const result = await query1(
        `INSERT INTO categories(id, name, created_by) 
        VALUES(?,?,?)`,
        [id, categoriesData.name, creator.id]
      );
      if (result.affectedRows === 0) {
        throw new Error("Course Category not created, check your input data");
      } return {
        userId: id,
        createdById: creator.id,
        createdByUsername: creator.username,
      };
    } catch (error) {
      throw error;
    }
  },
  updateCategories: async (categoriesId, categoriesData) => {
    try {
      const result = await query1(
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
  deleteCategory: async (categoriesId) => {
    try {
      const result = await query1(`DELETE FROM categories WHERE id = ?`, categoriesId);
      return result;
    } catch (error) {
      throw error;
    }
  }
};
module.exports = Categories;
