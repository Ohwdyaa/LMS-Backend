const { dbLms } = require("../config/db/db");
const { mapMySQLError } = require("../utils/custom_error");
const { uuid } = require("../utils/tools");

const Levels = {
  createLevel: async (data, userId) => {
    try {
      const id = uuid();
      const result = await dbLms(
        `
        INSERT INTO levels (
            id, 
            name,
            weight,
            created_by)
        VALUES (?, ?, ?, ?)`,
        [id, data.name, data.weight, userId]
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
  getLevelByName: async (name) => {
    try {
      const result = await dbLms(`SELECT id FROM levels WHERE name = ?`, [
        name,
      ]);
      return result;
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },
  getLevelById: async (id) => {
    try {
      const [result] = await dbLms(`SELECT id, name FROM levels WHERE id = ?`, [
        id,
      ]);
      return result;
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },
  getAllLevels: async () => {
    try {
      const result = await dbLms(`SELECT id, name, weight FROM levels WHERE is_deleted = 0`);
      return result;
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  }
};
module.exports = Levels;
