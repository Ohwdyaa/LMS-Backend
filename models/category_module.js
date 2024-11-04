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
      return result;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = moduleCategory;