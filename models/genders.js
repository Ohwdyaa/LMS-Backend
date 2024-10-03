const { query } = require("../config/db/db");
const { uuid } = require("../utils/tools");

const Genders = {
  createGender: async (genderData) => {
    console.log("Creating role with data:", genderData);
    try {
      const id = uuid();
      const result = await query(
        `
        INSERT INTO genders (
        id,
        name
        ) VALUES (?,?)`,
        [id, genderData.name]
      );
      return result;
    } catch (error) {
      throw new error();
    }
  },
  getGenderById: async (genderId) => {
    try {
      const [result] = await query(
        "SELECT * FROM genders WHERE id = ?",
        genderId
      );
      return result;
    } catch (error) {
      throw new error();
    }
  },
  getAllGenders: async () => {
    try {
      const result = await query(" SELECT * FROM genders ");
      return result;
    } catch (error) {
      throw new error();
    }
  },
  updateGender: async (genderId, genderData) => {
    try {
      const result = await query("SELECT FROM genders WHERE id = ?", [
        genderId,
        genderData,
      ]);
      return result;
    } catch (error) {
      throw new error();
    }
  },
  deleteGender: async (genderId) => {
    try {
      const result = await query("DELETE FROM genders WHERE id = ?", genderId);
      return result;
    } catch (error) {
      throw new error();
    }
  },
};

module.exports = Genders;
