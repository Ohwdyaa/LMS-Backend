const { query } = require("../config/db/db");
const { uuid } = require("../utils/tools");

const Religions = {
  createReligion: async (religionData) => {
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
      throw new error;
    }
  },
  getReligionById: async (religionId) => {
    try {
      const [result] = await query("SELECT * FROM religions WHERE id = ?", 
        religionId);
      return result;
    } catch (error) {
      throw new error;
    }
  },
  getAllReligions: async () => {
    try {
      const result = await query("SELECT * FROM religions");
      return result;
    } catch (error) {
      throw new error;
    }
  },

  updateReligion: async (religionId, religionData) => {
    try {
      const result = await query("UPDATE religions SET ? WHERE id = ?", [
        religionData,
        religionId,
      ]);
      return result;
    } catch (error) {
      throw new error;
    }
  },
  deleteReligion: async (religionId) => {
    try {
      const result = await query(" DELETE FROM religions where id = ? ", 
        religionId);
      return result;
    } catch (error) {
      throw new error;
    }
  },
};
module.exports = Religions;