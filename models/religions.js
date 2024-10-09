const { query1 } = require("../config/db/db");
const { uuid } = require("../utils/tools");

const Religions = {
  createReligion: async (religionData) => {
    try {
      const id = uuid();
      const result = await query1(
        `
        INSERT INTO religions (
        id,
        name
        ) VALUES (?,?)`,
        [id, religionData.name]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  getReligionById: async (religionId) => {
    try {
      const [result] = await query1("SELECT * FROM religions WHERE id = ?", 
        religionId);
      return result;
    } catch (error) {
      throw error;
    }
  },
  getAllReligions: async () => {
    try {
      const result = await query1("SELECT * FROM religions");
      return result;
    } catch (error) {
      throw error;
    }
  },

  updateReligion: async (religionId, religionData) => {
    try {
      const result = await query1("UPDATE religions SET ? WHERE id = ?", [
        religionData,
        religionId,
      ]);
      return result;
    } catch (error) {
      throw error;
    }
  },
  deleteReligion: async (religionId) => {
    try {
      const result = await query1(" DELETE FROM religions where id = ? ", 
        religionId);
      return result;
    } catch (error) {
      throw error;
    }
  },
};
module.exports = Religions;