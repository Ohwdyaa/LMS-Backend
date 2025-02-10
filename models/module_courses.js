const { dbLms } = require("../config/db/db");
const { mapMySQLError } = require("../utils/custom_error");
const { uuid } = require("../utils/tools");

const modulesCourse = {
  createModuleCourse: async (data, userId) => {
    try {
      const id = uuid();
      const result = await dbLms(
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
      const result = await dbLms(
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
      const result = await dbLms(
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
      const [result] = await dbLms(
        `SELECT 
          mc.id, 
          mc.title, 
          mc.description,
          mc.course_id,
          c.title as course
        FROM module_courses mc
        LEFT JOIN courses c ON mc.course_id = c.id
        WHERE mc.id = ? AND mc.is_deleted = 0`,
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
      const result = await dbLms(
        `SELECT 
          id, 
          title
        FROM module_courses 
        WHERE course_id = ? AND is_deleted = 0
        ORDER BY created_at ASC`,
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
  getModulesCountByCourseId: async (courseId) => {
    try {
      const [result] = await dbLms(
        `SELECT COUNT(*) as count FROM module_courses where course_id = ? AND is_deleted = 0`,
        [courseId]
      );
      return result.count;
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },
  softDeleteModuleCourse: async (id, userId) => {
    try {
      const result = await dbLms(
        `UPDATE module_courses 
        SET 
          is_deleted = 1, 
          updated_at = NOW(),
          updated_by = ? 
        WHERE id = ?`,
        [userId, id]
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
