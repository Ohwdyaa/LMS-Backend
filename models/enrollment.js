const { lmsManagement } = require("../config/db/db");
const { uuid } = require("../utils/tools");

const Enrollment = {
  enrollMentor: async (courseId, mentorId, userId) => {
    try {
      const id = uuid();
      const result = await lmsManagement(
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
      throw error;
    }
  },
  updateEnroll: async (id, userId) => {
    try {
      const result = await lmsManagement(
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
      throw error;
    }
  },
  existingEntry: async (courseId, mentorId) => {
    try {
      const [result] = await lmsManagement(
        `SELECT 
          e.id, 
          m.id as mentorId,
          m.fullname as name, 
          c.title as course
        FROM enrollments e
        LEFT JOIN mentors m ON e.mentor_id = m.id 
        LEFT JOIN courses c ON e.course_id = c.id
        WHERE e.course_id = ? AND e.mentor_id = ?`,
        [courseId, mentorId]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  existingEnroll: async (id) => {
    try {
      const [result] = await lmsManagement(
        `SELECT 
          e.id, 
          m.id as mentorId,
          m.fullname as name, 
          c.title as course
        FROM enrollments e
        LEFT JOIN mentors m ON e.mentor_id = m.id
        LEFT JOIN courses c ON e.course_id = c.id 
        WHERE e.id = ?`,
        [id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  getCourseParticipants: async (courseId) => {
    try {
      const result = await lmsManagement(
        `SELECT 
          e.id, 
          m.id as mentorId,
          m.fullname as name,
          r.name as role
        FROM enrollments e
        LEFT JOIN mentors m ON e.mentor_id = m.id
        LEFT JOIN roles r ON u.role_id = r.id 
        LEFT JOIN courses c ON e.course_id = c.id 
        WHERE e.course_id = ? AND e.is_deleted = 0`,
        [courseId]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  unEnroll: async (id, userId) => {
    try {
      const result = await lmsManagement(
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
      throw error;
    }
  },
};

module.exports = Enrollment;
