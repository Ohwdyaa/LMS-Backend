const { dbLms } = require("../config/db/db");
const { mapMySQLError } = require("../utils/custom_error");
const { uuid } = require("../utils/tools");

const Assignment = {
  createAssignment: async (data, userId, subModulesId) => {
    try {
      const id = uuid();
      await dbLms(
        `INSERT INTO assignments (
            id,
            title,
            description,
            deadline,
            created_by,
            sub_modules_id
            ) VALUES (?, ?, ?, ?, ?, ?)`,
        [id, data.title, data.description, data.deadline, userId, subModulesId]
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

  updateAssignment: async (id, data, userId) => {
    try {
      const result = await dbLms(
        `UPDATE assignments 
            SET title = ?, description = ?, deadline = ?, updated_by = ?, updated_at = NOW()
            WHERE id = ?`,
        [data.title, data.description, data.deadline, userId, id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },

  getAssignmentBySubModule: async (id) => {
    try {
      const [result] = await dbLms(
        `SELECT 
            a.id,
            a.title,
            a.description,
            a.deadline
            FROM assignments a
            LEFT JOIN sub_modules sm ON a.sub_modules_id = sm.id
            WHERE a.sub_modules_id = ?`,
        [id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = Assignment;
