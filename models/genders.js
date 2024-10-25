const { query1 } = require("../config/db/db");
const { uuid } = require("../utils/tools");

const Genders = {
  createGender: async (genderData) => {
    try {
      const id = uuid();
      const result = await query1(
        `
        INSERT INTO genders (
        id,
        name
        ) VALUES (?,?)`,
        [id, genderData.name]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  getAllGenders: async () => {
    try {
      const result = await query1(" SELECT id, name FROM genders WHERE is_deleted = 0");
      return result;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = Genders;
