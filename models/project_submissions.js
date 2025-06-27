const { dbLms } = require("../config/db/db");
const { mapMySQLError } = require("../utils/custom_error");
const { uuid } = require("../utils/tools");

const ProjectSubmissions = {
  submit: async (userId, projectId, fileUrl) => {
    try {
      // Cek apakah user sudah pernah submit
      const [existing] = await dbLms(
        `SELECT id FROM project_submissions 
         WHERE mentees_id = ? AND project_id = ?`,
        [userId, projectId]
      );

      if (existing) {
        throw new Error("You have already submitted this project.");
      }

      const id = uuid();
      await dbLms(
        `INSERT INTO project_submissions 
        (id, mentees_id, project_id, file_url, submitted_at, created_by) 
        VALUES (?, ?, ?, ?, NOW(), ?)`,
        [id, userId, projectId, fileUrl, userId]
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

  getSubmissionStatus: async (userId, projectId) => {
    try {
      const [submission] = await dbLms(
        `SELECT id, file_url, submitted_at 
         FROM project_submissions 
         WHERE mentees_id = ? AND project_id = ?`,
        [userId, projectId]
      );
      return submission;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = ProjectSubmissions;
