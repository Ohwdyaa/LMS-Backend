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
  getGenderById: async (genderId) => {
    try {
      const result = await query1(
        "SELECT name FROM genders WHERE id = ?",
        [genderId]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  getAllGenders: async () => {
    try {
      const result = await query1(" SELECT id, name FROM genders");
      return result;
    } catch (error) {
      throw error;
    }
  },
  updateGender: async (genderId, genderData) => {
    try {
      const result = await query1("SELECT FROM genders WHERE id = ?", [
        genderId,
        genderData,
      ]);
      return result;
    } catch (error) {
      throw error;
    }
  },
  deleteGender: async (genderId) => {
    try {
      const result = await query1("DELETE FROM genders WHERE id = ?", genderId);
      return result;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = Genders;
