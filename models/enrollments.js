const { dbLms } = require("../config/db/db");
const { mapMySQLError } = require("../utils/custom_error");
const { uuid } = require("../utils/tools");

const Enrollments = {
  enrollMentor: async (courseId, mentorId, userId) => {
    try {
      const id = uuid();
      const result = await dbLms(
        `INSERT INTO enrollments(
          id, 
          created_by,
          course_id,
          mentor_id) 
        VALUES (?,?,?,?)`,
        [id, userId, courseId, mentorId]
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
  updateEnroll: async (id, userId) => {
    try {
      const result = await dbLms(
        `UPDATE 
          enrollments
        SET 
          is_deleted = 0,
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
  existingEntry: async (courseId, mentorId) => {
    try {
      const [result] = await dbLms(
        `SELECT 
          id
        FROM enrollments
        WHERE course_id = ? AND mentor_id = ?`,
        [courseId, mentorId]
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
  existingEnroll: async (id) => {
    try {
      const [result] = await dbLms(
        `SELECT 
          id
        FROM enrollments
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
  getCourseParticipants: async (courseId) => {
    try {
      const result = await dbLms(
        `SELECT 
          e.id, 
          m.id as mentorId,
          m.fullname as name,
          r.name as role
        FROM enrollments e
        LEFT JOIN mentors m ON e.mentor_id = m.id
        LEFT JOIN role_mentors r ON m.role_id = r.id 
        LEFT JOIN courses c ON e.course_id = c.id 
        WHERE e.course_id = ? AND e.is_deleted = 0`,
        [courseId]
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
  unEnroll: async (id, userId) => {
    try {
      const result = await dbLms(
        `UPDATE 
          enrollments
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
  unEnrollByMentor: async (id, userId) => {
    try {
      const result = await dbLms(
        `UPDATE 
          enrollments
        SET 
          is_deleted = 1,
          updated_at = NOW(),
          updated_by = ?
        WHERE mentor_id = ?`,
        [userId, id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = Enrollments;
