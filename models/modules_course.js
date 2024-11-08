const { lmsManagement } = require("../config/db/db");
const { uuid } = require("../utils/tools");

const modulesCourse = {
  createModuleCourse: async (data, userId) => {
    try {
      const id = uuid();
      const result = await lmsManagement(
        `INSERT INTO module_courses(
          id, 
          title, 
          description, 
          created_by,
          course_id) 
        VALUES (?,?,?,?,?)`,
        [id, data.title, data.description, userId, data.courseId]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }, 
  updateModuleCourse: async (id, data, userId) => {
    try {
      const result = await lmsManagement(
        `UPDATE 
          module_courses 
        SET 
          title = ?, 
          description = ?,  
          updated_at = NOW(),
          updated by = ?
        WHERE id = ?`,
        [data.title, data.description, userId, id]
      );
      return result;
    } catch (error) {}
  },
  deleteModuleCourse: async (id) => {
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
  getModuleById: async (id) => {
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