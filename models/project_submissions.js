const { dbLms } = require("../config/db/db");
const { mapMySQLError } = require("../utils/custom_error");
const { uuid } = require("../utils/tools");

const ProjectSubmissions = {
  createSubmission: async (data, userId) => {
    try {
      const id = uuid();
      await dbLms(
        `INSERT INTO project_submissions (
          id, 
          description,
          file_url,
          mentees_id, 
          project_id,
          created_by) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [id, data.description, data.fileUrl, userId, data.projectId, userId]
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
  getSubmissionByMenteeAndProject: async (userId, id) => {
    try {
      const [result] = await dbLms(
        `SELECT 
          id,
          file_url,
          submitted_at
        FROM project_submissions 
         WHERE mentees_id = ? 
          AND project_id = ?`,
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
        FROM project_submissions 
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
      const result = await dbLms(
        `SELECT 
          ps.id, 
          ps.file_url, 
          ps.submitted_at,
          ps.project_id,
          p.title as project,
          ps.mentees_id,
          m.fullname as mentee
        FROM project_submissions as ps
          LEFT JOIN projects p on p.id = ps.project_id
          LEFT JOIN mentee_management.mentees m on m.id = ps.mentees_id
        WHERE ps.is_deleted = 0`
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = ProjectSubmissions;
