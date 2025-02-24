const { dbMentee } = require("../config/db/db");
const { mapMySQLError } = require("../utils/custom_error");
const { uuid } = require("../utils/tools");

const Class = {
  createClass: async (name, userId) => {
    try {
      const id = uuid();
      await dbMentee(
        `INSERT INTO class (
            id, 
            name,
            created_by)
        VALUES (?, ?, ?)`,
        [id, name, userId]
      );
      return id;
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },
  getClassByName: async (name) => {
    try {
      const [result] = await dbMentee(
        `SELECT 
            id, 
            name
          FROM class 
          WHERE name = ? AND is_deleted = 0`,
        [name]
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
module.exports = Class;
