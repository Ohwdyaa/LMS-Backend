const { lmsManagement } = require("../config/db/db");
const { uuid } = require("../utils/tools");

const modulesCourse = {
  createModulesCourse: async (data) => {
    try {
      const id = uuid();
      const result = await lmsManagement(
        `INSERT INTO module_courses(
          id, 
          title, 
          description, 
          course_id) 
        VALUES (?,?,?,?)`,
        [id, data.title, data.description, data.courseId]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  },
  updateModulesCourse: async (id, data) => {
    try {
      const result = await lmsManagement(
        `UPDATE 
          module_courses 
        SET 
          title = ?, 
          description = ?, 
          course_id = ?, 
          updated_at = NOW()
        WHERE id = ?`,
        [data.title, data.description, , data.courseId, id]
      );
      return result;
    } catch (error) {}
  },
  deleteModulesCourse: async (id) => {
    try {
      const result = await lmsManagement(
        `DELETE FROM module_courses WHERE id=?`,
        id
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  getAllModulesCourse: async () => {
    try {
      const result = await lmsManagement(
        `SELECT 
          mc.id, 
          mc.title, 
          mc.course_id,
          c.title as course
        FROM module_courses mc
        LEFT JOIN courses c ON mc.course_id = c.id`
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  getModulesById: async (id) => {
    try {
      const [result] = await lmsManagement(
        `SELECT 
          mc.id, 
          mc.title, 
          mc.course_id,
          c.title as course
        FROM module_courses mc
        LEFT JOIN courses c ON mc.course_id = c.id
        WHERE mc.id = ?`,
        [id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
};
module.exports = modulesCourse;