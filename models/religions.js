const { query1 } = require("../config/db/db");
const { uuid } = require("../utils/tools");

const Religions = {
  createReligion: async (data) => {
    try {
      const id = uuid();
      const result = await query1(
        `
        INSERT INTO religions (
        id,
        name
        ) VALUES (?,?)`,
        [id, data.name]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  getAllReligion: async () => {
    try {
      const result = await query1("SELECT id, name FROM religions WHERE is_deleted = 0");
      return result;
    } catch (error) {
      throw error;
    }
  },
};
module.exports = Religions;