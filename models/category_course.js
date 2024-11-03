const { lmsManagement } = require("../config/db/db");
const { uuid } = require("../utils/tools");
const Users = require("../models/users");

const Categories = {
  createCategories: async (categoriesData, creatorEmail) => {
    try {
      const creator = await Users.getUserByEmail(creatorEmail);
      if(creator === undefined || creator=== null){
        throw new Error ('Creator not found');
      }
      creatorId = creator.id;
      creatorUsername = creator.username;
  
      const id = uuid();
      const result = await lmsManagement(
        `INSERT INTO categories(id, name, created_by) 
        VALUES(?,?,?)`,
        [id, categoriesData.name, creatorId]
      );
      console.log("category course created : ", {
        id, 
        name : categoriesData.name,
        created_by : creatorId,
        created_by_username : creatorUsername,
       });
      return result;
    } catch (error) {
      throw error;
    }
  },
  updateCategories: async (categoriesId, categoriesData) => {
    try {
      const result = await lmsManagement(
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
      const result = await lmsManagement(`DELETE FROM categories WHERE id = ?`, categoriesId);
      return result;
    } catch (error) {
      throw error;
    }
  }
};
module.exports = Categories;
