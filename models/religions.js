const { query1 } = require("../config/db/db");
const { uuid } = require("../utils/tools");

const Religions = {
  createReligion: async (data, createdByEmail) => {
    try {
      const [creator] = await query1("SELECT id, username FROM users WHERE email = ?", [createdByEmail]);
      if (!creator) throw new Error("Creator not found");

      const id = uuid();
      const result = await query1(
        `
        INSERT INTO religions (
        id,
        name,
        created_by
        ) VALUES (?,?, ?)`,
        [id, data.name, creator.id ]
      );
      if (result.affectedRows === 0) {
        throw new Error("Role not created, check your input data");
      } return {
        userId: id,
        createdById: creator.id,
        createdByUsername: creator.username,
      };
    } catch (error) {
      throw error;
    }
  },
  getAllReligion: async () => {
    try {
      const result = await query1("SELECT name FROM religions WHERE is_deleted = 0");
      return result;
    } catch (error) {
      throw error;
    }
  },
};
module.exports = Religions;