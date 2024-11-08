const { lmsManagement } = require("../config/db/db");
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
      throw error;
    }
  },
  getAllGenders: async () => {
    try {
      const result = await lmsManagement(" SELECT name FROM genders WHERE is_deleted = 0");
      return result;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = Genders;