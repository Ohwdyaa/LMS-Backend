const { query2 } = require("../config/db/db");
const { uuid } = require("../utils/tools");

const moduleCategory = {
  createCategory: async (data, createdByEmail) => {
    try {
      const [creator] = await query1("SELECT id, username FROM users WHERE email = ?", [createdByEmail]);
      if (!creator) throw new Error("Creator not found");

      const id = uuid();
      const result = await query2(
        `INSERT INTO category_module(
          uuid, 
          name,
          created_by
        ) 
        VALUES (?, ?, ?)`,
        [id, data.name, creator.id]
      );
      if (result.affectedRows === 0) {
        throw new Error("Module Category not created, check your input data");
      } return {
        userId: id,
        createdById: creator.id,
        createdByUsername: creator.username,
      };
    } catch (error) {
      throw error;
    }
  },
};

module.exports = moduleCategory;