const { query } = require("../config/db/db");
const { uuid } = require("../utils/tools");
const { err } = require("../utils/customError");

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
      if (result.length === 0) {
        return null;
      }

      return result;
    } catch (error) {
      throw err.dataErr;
    }
  },
  getGenderById: async (genderId) => {
    try {
      const [result] = await query("SELECT * FROM genders WHERE id = ?", [
        genderId,
      ]);
      if (result.length === 0) {
        return null;
      }

      return result;
    } catch (error) {
      throw err.dataErr;
    }
  },
};

module.exports = Genders;
