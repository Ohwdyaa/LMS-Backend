const { query } = require("../config/db/db");

const Religions = {
  getReligionById: async (religionId) => {
    try {
      const [result] = await query("SELECT * FROM religions WHERE id = ?", [
        religionId,
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

module.exports = Religions;
