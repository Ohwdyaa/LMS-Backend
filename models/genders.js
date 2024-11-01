const { query1 } = require("../config/db/db");
const { uuid } = require("../utils/tools");

const Genders = {
  createGender: async (genderData, createdByEmail) => {
    try {
      const [creator] = await query1("SELECT id, username FROM users WHERE email = ?", [createdByEmail]);
      if (!creator) throw new Error("Creator not found");

      const id = uuid();
      const result = await query1(
        `
        INSERT INTO genders (
        id,
        name,
        created_by
        ) VALUES (?,?,?)`,
        [id, genderData.name, creator.id]
      );
      if (result.affectedRows === 0) {
        throw new Error("Role not created, check your input data");
      } return {
        userId: id,
        createdById: creator.id,
        createdByUsername: creator.username,
      };
    } catch (error) {
      throw error;
    }
  },
  getAllGenders: async () => {
    try {
      const result = await query1(" SELECT name FROM genders");
      return result;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = Genders;
