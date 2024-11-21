const { lmsManagement } = require("../config/db/db");
const { mapMySQLError } = require("../utils/custom_error");
const { uuid } = require("../utils/tools");

const Genders = {
  createGender: async (data) => {
    try {
      const id = uuid();
      const result = await lmsManagement(
        `INSERT INTO genders 
          (id,
          name)
        VALUES (?, ?)`,
        [id, data.name]
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
  getAllGenders: async () => {
    try {
      const result = await lmsManagement(" SELECT id, name FROM genders WHERE is_deleted = 0");
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

module.exports = Genders;