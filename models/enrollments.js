const { dbLms, dbMentee } = require("../config/db/db");
const { mapMySQLError } = require("../utils/custom_error");
const { uuid } = require("../utils/tools");

const Enrollments = {
  enrollMentor: async (courseId, mentorId, userId) => {
    try {
      const id = uuid();
      const result = await dbLms(
        `INSERT INTO mentor_enrollments(
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
  enrollMentee: async (courseId, menteeId, userId) => {
    try {
      const id = uuid();
      const result = await dbMentee(
        `INSERT INTO mentee_enrollments(
          id, 
          created_by,
          courses_id,
          mentees_id) 
        VALUES (?,?,?,?)`,
        [id, userId, courseId, menteeId]
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
  updateEnrollMentor: async (id, userId) => {
    try {
      const result = await dbLms(
        `UPDATE 
          mentor_enrollments
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
  updateEnrollMentee: async (id, userId) => {
    try {
      const result = await dbMentee(
        `UPDATE 
          mentee_enrollments
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
  existingMentor: async (courseId, mentorId) => {
    try {
      const [result] = await dbLms(
        `SELECT 
          id
        FROM mentor_enrollments
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
  existingMentee: async (courseId, menteeId) => {
    try {
      const [result] = await dbMentee(
        `SELECT 
          id
        FROM mentee_enrollments
        WHERE courses_id = ? AND mentees_id = ?`,
        [courseId, menteeId]
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
  getMentorByCourse: async (courseId) => { 
    try {
      const result = await dbLms(
        `SELECT 
          e.id, 
          m.id as mentorId,
          m.fullname,
          r.name as role,
          sb.name as subCategories
        FROM mentor_enrollments e
        LEFT JOIN mentors m ON e.mentor_id = m.id
        LEFT JOIN role_mentors r ON m.role_id = r.id 
        LEFT JOIN courses c ON e.course_id = c.id
        LEFT JOIN sub_categories sb ON m.sub_category_id = sb.id  
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
  getMenteeByCourse: async (courseId) => { 
    try {
      const result = await dbMentee(
        `SELECT 
          e.id, 
          m.id as menteeId,
          m.fullname as name
        FROM mentee_management.mentee_enrollments e
        LEFT JOIN mentee_management.mentees m ON e.mentees_id = m.id
        LEFT JOIN learning_management_system.courses c ON e.courses_id = c.id 
        WHERE e.courses_id = ? AND e.is_deleted = 0`,
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
          mentor_enrollments
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
