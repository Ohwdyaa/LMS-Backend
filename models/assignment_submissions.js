const { dbLms } = require("../config/db/db");
const { mapMySQLError } = require("../utils/custom_error");
const { uuid } = require("../utils/tools");

const AssignmentSubmissions = {
  createSubmission: async (data, userId) => {
    try {
      const id = uuid();
      await dbLms(
        `INSERT INTO assignment_submissions (
          id,
          description, 
          file_url,
          mentees_id, 
          assignments_id,
          created_by) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [id, data.description, data.fileUrl, userId, data.assignmentId, userId]
      );
      return id;
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },
  getSubmissionByMenteeAndAssign: async (userId, id) => {
    try {
      const [result] = await dbLms(
        `SELECT 
          id,
          file_url,
          submitted_at
        FROM assignment_submissions 
         WHERE mentees_id = ? 
          AND assignments_id = ?`,
        [userId, id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  getSubmissionById: async (id) => {
    try {
      const [result] = await dbLms(
        `SELECT 
          id,
          file_url,
          submitted_at
        FROM assignment_submissions 
         WHERE id = ?`,
        [id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  getAllSubmissions: async () => {
    try {
      const submission = await dbLms(
        `SELECT 
          asub.id, 
          asub.file_url, 
          asub.submitted_at,
          asub.assignments_id,
          a.title as assignment,
          asub.mentees_id,
          m.fullname as mentee,
          e.score
        FROM assignment_submissions as asub
          LEFT JOIN assignments a on a.id = asub.assignments_id
          LEFT JOIN mentee_management.mentees m on m.id = asub.mentees_id
          LEFT JOIN mentee_management.evaluation e on e.assign_submission_id = asub.id
        WHERE asub.is_deleted = 0`
      );
      return submission;
    } catch (error) {
      throw error;
    }
  },
  getSubmissionByModule: async () => {
    try {
      const results = await dbLms(
        `SELECT 
          asub.id, 
          asub.file_url, 
          asub.submitted_at,
          asub.assignments_id,
          a.title as assignment,
          asub.mentees_id,
          m.fullname as mentee,
          e.score,
          sm.title as sub_module,
          mc.title as module_course
        FROM assignment_submissions as asub
          LEFT JOIN assignments a on a.id = asub.assignments_id
          LEFT JOIN sub_modules sm on sm.id = a.sub_modules_id
          LEFT JOIN module_courses mc on mc.id = sm.module_course_id
          LEFT JOIN mentee_management.mentees m on m.id = asub.mentees_id
          LEFT JOIN mentee_management.evaluation e on e.assign_submission_id = asub.id
        WHERE asub.is_deleted = 0`
      );
      return results;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = AssignmentSubmissions;
