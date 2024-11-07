const { lmsManagement } = require("../config/db/db");
const { uuid } = require("../utils/tools");
const Users = require("../models/users");

const Genders = {
  createGender: async (genderData) => {
    try {
      const id = uuid();
      const result = await lmsManagement(
        `
        INSERT INTO genders (
        id,
        name
        ) VALUES (?, ?)`,
        [id, genderData.name]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  getAllGenders: async () => {
    try {
      const result = await lmsManagement(" SELECT name FROM genders");
      return result;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = Genders;
