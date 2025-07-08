const { dbMentee } = require("../config/db/db");
const { mapMySQLError } = require("../utils/custom_error");
const { uuid } = require("../utils/tools");

const Evaluation = {
  createEvaluationQuiz: async (score, typesId, userId, quizzesId) => {
    try {
      const id = uuid();
      await dbMentee(
        `
          INSERT INTO evaluation (
              id, 
              score,
              created_by,
              type_id,
              quizzes_id,
              mentees_id)
          VALUES (?, ?, ?, ?, ?, ?)`,
        [id, score, userId, typesId, quizzesId, userId]
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
  createEvaluationAssign: async (score, data, typesId, userId) => {
    try {
      const id = uuid();
      await dbMentee(
        `
          INSERT INTO evaluation (
              id, 
              score,
              feedback,
              created_by,
              type_id,
              assign_submission_id,
              mentees_id)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id, score, data.feedback, userId, typesId, data.assignSubmitId, data.menteesId]
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
  createEvaluationProject: async (score, data, typesId, userId) => {
    try {
      const id = uuid();
      await dbMentee(
        `
          INSERT INTO evaluation (
              id, 
              score,
              feedback,
              created_by,
              type_id,
              project_submission_id,
              mentees_id)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id, score, data.feedback, userId, typesId, data.projectSubmitId, data.menteesId]
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
  updateEvaluation: async (score, userId, id) => {
    try {
      await dbMentee(
        `
          UPDATE 
            evaluation 
          SET 
            score = ?,
            updated_at = NOW(),
            updated_by = ? 
          WHERE id = ?`,
        [score, userId, id]
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
  getScoreById: async (id) => {
    try {
      const [result] = await dbMentee(
        `SELECT 
          score
        FROM evaluation 
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
  getScoreByQuizAndUser: async (quizId, menteesId) => {
    try {
      const [result] = await dbMentee(
        `
          SELECT 
            id,
            score
          FROM evaluation 
          WHERE quizzes_id = ? 
          AND mentees_id = ?`,
        [quizId, menteesId]
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
  getScoreByAssignAndUser: async (id, menteesId) => {
    try {
      const [result] = await dbMentee(
        `SELECT 
          id,
          score
        FROM evaluation 
        WHERE assign_submission_id = ? 
          AND mentees_id = ?`,
        [id, menteesId]
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
  getScoreByProjectAndUser: async (id, menteesId) => {
    try {
      const [result] = await dbMentee(
        `SELECT 
          id,
          score
        FROM evaluation 
        WHERE project_submission_id = ? 
          AND mentees_id = ?`,
        [id, menteesId]
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
  getScoreQuizByModule: async (id) => {
    try {
      const results = await dbMentee(
        `SELECT 
          e.id, 
          e.score,
          e.mentees_id,
          m.fullname as mentee,
          sm.title as sub_module,
          mc.title as module_course
        FROM evaluation e
          LEFT JOIN learning_management_system.quizzes q on q.id = e.quizzes_id
          LEFT JOIN learning_management_system.sub_modules sm on sm.id = q.sub_modules_id
          LEFT JOIN learning_management_system.module_courses mc on mc.id = sm.module_course_id
          LEFT JOIN mentees m on m.id = e.mentees_id
        WHERE mc.id = ? AND e.is_deleted = 0`,
        [id]
      );
      return results;
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },
};
module.exports = Evaluation;
