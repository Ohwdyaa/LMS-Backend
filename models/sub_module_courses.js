const { dbLms } = require("../config/db/db");
const { mapMySQLError } = require("../utils/custom_error");
const { uuid } = require("../utils/tools");

const subModules = {
  createSubModule: async (data, userId) => {
    try {
      const id = uuid();
      const result = await dbLms(
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
      const result = await dbLms(
        `UPDATE 
          sub_modules 
        SET 
          title = ?, 
          description = ?, 
          updated_at = NOW(),
          updated_by = ?,
          content_type_id = ?
        WHERE id = ?`,
        [data.title, data.description, userId, data.contentTypeId, id]
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
  deleteSubModule: async (id) => {
    try {
      const result = await dbLms(`DELETE FROM sub_modules WHERE id = ?`, [id]);
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
      const [result] = await dbLms(
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
      const result = await dbLms(
        `SELECT 
          sm.id, 
          sm.title,
          sm.content_type_id as contentTypeId,
          ct.name as contentType
        FROM sub_modules sm
        LEFT JOIN content_types ct ON sm.content_type_id = ct.id
        WHERE module_course_id = ?
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
  getSubModulesCountByModuleId: async (moduleId) => {
    try {
      const [result] = await dbLms(
        `SELECT COUNT(*) as count FROM sub_modules where module_course_id = ?`,
        [moduleId]
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
  getSubModulesByContentType: async (id) => {
    try {
      const result = await dbLms(
        `SELECT id, title, module_course_id FROM sub_modules where content_type_id = ?`,
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
  getQuizSubModulesByCourseId: async (courseId, typeId) => {
  try {
    const result = await dbLms(
      `SELECT 
        sm.id, 
        sm.title, 
        sm.module_course_id,
        mc.title AS moduleCourse,
        ct.name AS contentType,
        q.due_date AS deadline
      FROM sub_modules sm
      LEFT JOIN module_courses mc ON sm.module_course_id = mc.id
      LEFT JOIN content_types ct ON sm.content_type_id = ct.id
      LEFT JOIN quizzes q ON q.sub_modules_id = sm.id
      WHERE mc.course_id = ? AND sm.content_type_id = ?
      ORDER BY sm.created_at ASC`,
      [courseId, typeId]
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
