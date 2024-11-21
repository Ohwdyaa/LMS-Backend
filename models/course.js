const { lmsManagement } = require("../config/db/db");
const { mapMySQLError } = require("../utils/custom_error");
const { uuid } = require("../utils/tools");

const Course = {
  createCourse: async (data, userId, enrollmentKey) => {
    try {
      const id = uuid();
      const result = await lmsManagement(
        `INSERT INTO courses(
          id, 
          title, 
          description, 
          thumbnail, 
          enrollment_key,   
          start_date, 
          end_date, 
          created_by) 
        VALUES (?,?,?,?,?,?,?,?)`,
        [
          id,
          data.title,
          data.description,
          data.thumbnail,
          enrollmentKey,
          data.startDate,
          data.endDate,
          userId,
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
  updateCourse: async (id, data, userId) => {
    try {
      const result = await lmsManagement(
        `UPDATE 
          courses 
        SET 
          title = ?, 
          description = ?, 
          thumbnail = ?, 
          enrollment_key = ?, 
          start_date = ?, 
          end_date = ?, 
          updated_at = NOW(),
          updated_by = ?
        WHERE id = ?`,
        [
          data.title,
          data.description,
          data.thumbnail,
          data.enrollmentKey,
          data.startDate,
          data.endDate,
          userId,
          id,
        ]
      );
      return result;
    } catch (error) {}
  },
  deleteCourse: async (id) => {
    try {
      const result = await lmsManagement(`DELETE FROM courses WHERE id=?`, id);
      return result;
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },
  getAllCourse: async () => {
    try {
      const result = await lmsManagement(
        `SELECT 
          id, 
          title, 
          description, 
          thumbnail, 
          start_date, 
          end_date
        FROM courses 
        WHERE is_deleted = 0`
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
  getCourseById: async (id) => {
    try {
      const [result] = await lmsManagement(
        `SELECT 
          id, 
          title, 
          description, 
          thumbnail, 
          start_date, 
          end_date,
          created_at
        FROM courses
        WHERE id = ?`,
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

module.exports = Course;
