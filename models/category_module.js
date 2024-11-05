const { lmsModule } = require("../config/db/db");
const { uuid } = require("../utils/tools");
const Users = require("../models/users");

const moduleCategory = {
  createCategory: async (data, userId) => {
    try {
      const id = uuid();
      const result = await lmsModule(
        `INSERT INTO category_module(
          uuid, 
          name,
          created_by
        ) 
        VALUES (?,?,?)`,
        [id, data.name, userId]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  },
  updateCategory: async (name, userId, module_category_id) => {
    try {
      console.log("User ID:", userId); 
      const result = await lmsModule(
        `UPDATE category_module
        SET name = ?, 
          updated_at = NOW(),
          updated_by = ?
        WHERE id = ?`,
        [ name, userId, module_category_id]
      );
      if (result.affectedRows === 0) {
        throw { statusCode: 404, message: "Gender not found or no changes made" };
      }
      console.log(result)
      return result.insertId;
    }catch (error) {
      console.error("Error updating religion:", error.message);
      throw error;
    }
}
};

module.exports = moduleCategory;