const { query1 } = require("../config/db/db");
const { uuid } = require("../utils/tools");

const subCategories = {
  createSubCategories: async (subData, createdByEmail) => {
    try {
      const [creator] = await query1("SELECT id, username FROM users WHERE email = ?", [createdByEmail]);
      if (!creator) throw new Error("Creator not found");

      const id = uuid();
      const result = await query1(
        `INSERT INTO sub_categories (id, name, categories_id) VALUES (?,?,?)`,
        [id, subData.name, subData.categories_id, creator.id]
      );
      //return result.insertId;
      if (result.affectedRows === 0) {
        throw new Error("Sub Category not created, check your input data");
      } return {
        userId: id,
        createdById: creator.id,
        createdByUsername: creator.username,
      };
    } catch (error) {
      throw error;
    }
  },
  updateSubCategories: async (subId, subData, updatedByEmail) => {
    try {
      const [creator] = await query1("SELECT id, username FROM users WHERE email = ?", [updatedByEmail]);
      if (!creator) throw new Error("Creator not found");

      const result = await query1(
        `UPDATE sub_categories SET name = ?, categories_id = ?, updated_by =?`,
        [subData.name, subId, creator.id]
      );
      console.log("Update result:", result);
      if (result.affectedRows === 0) {
        throw new Error("Data not Updated, check your input data");
      }  const updatedUser = await query1(
        `SELECT * FROM users WHERE email = ?`,
        [userEmail]
      );
  
      return {
        user : updatedUser[0],
      };
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