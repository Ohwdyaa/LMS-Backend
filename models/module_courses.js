const { learningManagementSystem } = require("../config/db/db");
const { mapMySQLError } = require("../utils/custom_error");
const { uuid } = require("../utils/tools");

const modulesCourse = {
  createModuleCourse: async (data, userId) => {
    try {
      const id = uuid();
      const result = await learningManagementSystem(
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
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },
  updateModuleCourse: async (id, data, userId) => {
    try {
      const result = await learningManagementSystem(
        `UPDATE 
          module_courses 
        SET 
          title = ?, 
          description = ?,  
          updated_at = NOW(),
          updated_by = ?
        WHERE id = ?`,
        [data.title, data.description, userId, id]
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
  deleteModuleCourse: async (id) => {
    try {
      const result = await learningManagementSystem(
        `DELETE FROM module_courses WHERE id=?`,
        id
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
  getModuleById: async (id) => {
    try {
      const [result] = await learningManagementSystem(
        `SELECT 
          mc.id, 
          mc.title, 
          mc.description,
          mc.course_id,
          c.title as course
        FROM module_courses mc
        LEFT JOIN courses c ON mc.course_id = c.id
        WHERE mc.id = ?`,
        [id]
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
  getModuleByCourse: async (id) => {
    try {
      const result = await learningManagementSystem(
        `SELECT 
          id, 
          title
        FROM module_courses
        WHERE course_id = ?`,
        [id]
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

module.exports = modulesCourse;
