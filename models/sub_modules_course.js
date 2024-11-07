const { lmsManagement } = require("../config/db/db");
const { uuid } = require("../utils/tools");

const subModules = {
  createSubModules: async (data, userId) => {
    try {
      const id = uuid();
      const result = await lmsManagement(
        `INSERT INTO sub_modules(
          id, 
          title, 
          description, 
          created_by,
          module_course_id,
          content_type_id) 
        VALUES (?,?,?,?,?)`,
        [id, data.title, data.description, userId, data.moduleCourseId, data.contentTypeId]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  },
  updateSubModules: async (id, data, userId) => {
    try {
      const result = await lmsManagement(
        `UPDATE 
          sub_modules 
        SET 
          title = ?, 
          description = ?, 
          module_course_id = ?,
          content_type_id = ?, 
          updated_at = NOW(),
          updated_by = ?
        WHERE id = ?`,
        [data.title, data.description, , data.moduleCourseId, data.contentTypeId, userId, id]
      );
      console.log(result)
      return result;
    } catch (error) {}
  },
  deleteSubModules: async (id) => {
    try {
      const result = await lmsManagement(
        `DELETE FROM sub_modules WHERE id=?`,
        id
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  getAllSubModules: async () => {
    try {
      const result = await lmsManagement(
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
        LEFT JOIN content_types ct ON sm.content_type_id = ct.id`
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  getByIdSubModules: async (id) => {
    try {
      const [result] = await lmsManagement(
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
      throw error;
    }
  },
};
module.exports = subModules;