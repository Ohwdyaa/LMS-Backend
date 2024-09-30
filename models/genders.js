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
      console.error("Error creating role:", error);
      throw new Error("Database error");
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
      throw new Error("Database error");
    }
  },
};

module.exports = Genders;
