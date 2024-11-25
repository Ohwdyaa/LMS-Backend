const { learningManagementSystem } = require("../config/db/db");
const { mapMySQLError } = require("../utils/custom_error");
const { uuid } = require("../utils/tools");

const subModules = {
  createSubModule: async (data, userId) => {
    try {
      const id = uuid();
      const result = await learningManagementSystem(
        `INSERT INTO sub_modules(
          id, 
          title, 
          description, 
          created_by,
          module_course_id,
          content_type_id) 
        VALUES (?,?,?,?,?,?)`,
        [
          id,
          data.title,
          data.description,
          userId,
          data.moduleCourseId,
          data.contentTypeId,
        ]
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
  updateSubModule: async (id, data, userId) => {
    try {
      const result = await learningManagementSystem(
        `UPDATE 
          sub_modules 
        SET 
          title = ?, 
          description = ?, 
          updated_at = NOW(),
          updated_by = ?
        WHERE id = ?`,
        [data.title, data.description, userId, id]
      );
      console.log(result);
      return result;
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },
  deleteSubModule: async (id) => {
    try {
      const result = await learningManagementSystem(
        `DELETE FROM sub_modules WHERE id=?`,
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
  getSubModulesById: async (id) => {
    try {
      const [result] = await learningManagementSystem(
        `SELECT 
          sm.id, 
          sm.title, 
          sm.description,
          sm.passing_score,
          sm.module_course_id,
          sm.content_type_id,
          mc.title as moduleCourse,
          ct.name as contentType
        FROM sub_modules sm
        LEFT JOIN module_courses mc ON sm.module_course_id = mc.id
        LEFT JOIN content_types ct ON sm.content_type_id = ct.id
        WHERE sm.id = ?`,
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
  getSubModuleByModuleCourse: async (id) => {
    try {
      const result = await learningManagementSystem(
        `SELECT 
          id, 
          title
        FROM sub_modules
        WHERE module_course_id = ?`,
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

module.exports = subModules;
