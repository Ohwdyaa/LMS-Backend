const { query } = require("../config/db/db");
const { uuid } = require("../utils/tools");

const Religions = {
  createReligion: async (religionData) => {
    console.log("Creating role with data:", religionData);
    try {
      const id = uuid();
      const result = await query(
        `
        INSERT INTO religions (
        id,
        name
        ) VALUES (?,?)`,
        [id, religionData.name]
      );
      return result;
    } catch (error) {
      console.error("Error creating role:", error);
      throw new Error("Database error");
    }
  },
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
