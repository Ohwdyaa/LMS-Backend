const { dbLms } = require("../config/db/db");
const { mapMySQLError } = require("../utils/custom_error");
const { uuid } = require("../utils/tools");

const Religions = {
  createReligion: async (data) => {
    try {
      const id = uuid();
      const result = await dbLms(
        `
        INSERT INTO religions 
          (id,
          name) 
        VALUES (?,?)`,
        [id, data.name]
      );
      return result.insertId;
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },
  getAllReligion: async () => {
    try {
      const result = await dbLms(
        "SELECT id, name FROM religions WHERE is_deleted = 0"
      );
      return result;
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },
};

module.exports = Religions;
