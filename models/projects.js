const { dbLms } = require("../config/db/db");
const { mapMySQLError } = require("../utils/custom_error");
const { uuid } = require("../utils/tools");

const Projects = {
  createProject: async (data, userId, subModulesId) => {
    try {
      console.log(userId)
      const id = uuid();
      await dbLms(
        `INSERT INTO project (
          id,
          title,
          decription,
          due_date,
          created_by,
          sub_modules_id
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [id, data.title, data.description, data.due_date, userId, subModulesId]
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

  updateProject: async (id, data, userId) => {
    try {
      const result = await dbLms(
        `UPDATE project 
         SET title = ?, decription = ?, due_date = ?, updated_by = ?, updated_at = NOW()
         WHERE id = ?`,
        [data.title, data.description, data.deadline, userId, id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },

  getProjectBySubModule: async (id) => {
    try {
      const [result] = await dbLms(
        `SELECT 
           p.id,
           p.title,
           p.decription,
           p.due_date,
           sm.title as subModule
         FROM project p
         LEFT JOIN sub_modules sm ON p.sub_modules_id = sm.id
         WHERE p.sub_modules_id = ?`,
        [id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = Projects;
