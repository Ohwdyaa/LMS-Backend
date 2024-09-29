const { query } = require("../config/db/db");

const Genders = {
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
