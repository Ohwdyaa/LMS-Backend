const { lmsManagement } = require("../config/db/db");
const { uuid } = require("../utils/tools");
const Users = require("../models/users");

const Religions = {
  createReligion: async (data) => {
    try {
      const id = uuid();
      const result = await lmsManagement(
        `
        INSERT INTO religions (
        id,
        name
        ) VALUES (?,?)`,
        [id, data.name]
      );
      return result.insertId;
      }catch (error) {
        console.error("Error creating religion:", error.message);
        throw error;
      }
  },
  getAllReligion: async () => {
    try {
      const result = await lmsManagement("SELECT name FROM religions WHERE is_deleted = 0");
      return result;
    } catch (error) {
      throw error;
    }
  },
};
module.exports = Religions;