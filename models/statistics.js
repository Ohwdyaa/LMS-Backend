const { dbLms, dbMentee } = require("../config/db/db");
const { mapMySQLError } = require("../utils/custom_error");

const Statistics = {
  getTotalMentees: async (id) => {
    try {
      const result = await dbMentee(
        `SELECT COUNT(mentees_id) AS total FROM mentee_enrollments WHERE courses_id = ?`,
        [id]
      );
      return result[0].total;
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },
  getAllScoresByCourse: async (courseId) => {
    try {
      const result = await dbMentee(
        `SELECT 
          e.score, 
          e.type_id,
          te.name as type
         FROM evaluation e
         LEFT JOIN mentee_enrollments en ON e.mentees_id = en.mentees_id
         LEFT JOIN types_evaluation te ON e.type_id = te.id
         WHERE en.courses_id = ?
           AND (te.name = 'Quizzes' OR te.name = 'Assignment')`,
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
  countAtRiskStudents: async (courseId) => {
    try {
      const result = await dbMentee(
        `SELECT COUNT(mentees_id) as atRiskCount FROM (
          SELECT e.mentees_id
        FROM evaluation e
        JOIN mentee_enrollments en ON e.mentees_id = en.mentees_id
          WHERE en.courses_id = ?
          GROUP BY e.mentees_id
          HAVING AVG(e.score) < 65
        ) AS at_risk_table`,
        [courseId]
      );
      return result[0];
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },
  countActiveMentees: async (courseId) => {
    try {
      const result = await dbMentee(
        `SELECT 
          COUNT(*) AS engagedCount
        FROM (
          SELECT
            mentees_id,
            SUM(duration_minutes) AS total_duration
          FROM
            course_sessions
          WHERE
              courses_id = ?
            AND session_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)
          GROUP BY
              mentees_id
          ) AS mentee_durations
          WHERE
            total_duration >= 180;`,
        [courseId]
      );
      return result[0];
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },
  getAssignmentScoreByModule: async (courseId) => {
    try {
      const result = await dbLms(
        `SELECT 
          sm.module_course_id AS moduleId, 
          mc.title AS moduleName,
          e.score, 
          e.mentees_id
        FROM mentee_management.evaluation e
        JOIN assignment_submissions asub ON e.assign_submission_id = asub.id
        JOIN assignments a ON asub.assignments_id = a.id
        JOIN sub_modules sm ON a.sub_modules_id = sm.id
        JOIN module_courses mc ON sm.module_course_id = mc.id
        WHERE mc.course_id = ? AND e.assign_submission_id IS NOT NULL;`,
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
  getQuizScoresByModule: async (courseId) => {
    try {
      const result = await dbLms(
        `SELECT 
          sm.module_course_id AS moduleId, 
          mc.title AS moduleName,
          e.score, 
          e.mentees_id
        FROM mentee_management.evaluation e
        JOIN quizzes q ON e.quizzes_id = q.id
        JOIN sub_modules sm ON q.sub_modules_id = sm.id
        JOIN module_courses mc ON sm.module_course_id = mc.id
        WHERE mc.course_id = ? AND e.quizzes_id IS NOT NULL;`,
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
  getAllStudentScores: async (courseId) => {
    try {
      const result = await dbMentee(
        `SELECT 
          e.mentees_id, 
          m.fullname AS menteeName,
          e.score, 
          te.name AS type
        FROM evaluation e
        INNER JOIN types_evaluation te ON te.id = e.type_id
        INNER JOIN learning_management_system.assignment_submissions asub ON e.assign_submission_id = asub.id
        INNER JOIN learning_management_system.assignments a ON asub.assignments_id = a.id
        INNER JOIN learning_management_system.sub_modules sm ON a.sub_modules_id = sm.id
        INNER JOIN learning_management_system.module_courses mc ON sm.module_course_id = mc.id
        INNER JOIN mentees m ON e.mentees_id = m.id
            WHERE mc.course_id = ? AND e.assign_submission_id IS NOT NULL

            UNION ALL

            -- Ambil semua skor dari KUIS dan beri label 'quiz'
            SELECT 
                e.mentees_id, 
                m.fullname AS menteeName,
                e.score, 
                te.name AS type
            FROM evaluation e
            INNER JOIN types_evaluation te ON te.id = e.type_id
            INNER JOIN learning_management_system.quizzes q ON e.quizzes_id = q.id
            INNER JOIN learning_management_system.sub_modules sm ON q.sub_modules_id = sm.id
            INNER JOIN learning_management_system.module_courses mc ON sm.module_course_id = mc.id
            INNER JOIN mentees m ON e.mentees_id = m.id
            WHERE mc.course_id = ? AND e.quizzes_id IS NOT NULL;
        `,
        [courseId, courseId]
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

  // Fungsi untuk mengambil SEMUA data engagement (durasi)
  getAllStudentEngagements: async (courseId) => {
    try {
      const result = await dbMentee(
        `SELECT
            me.mentees_id,
            SUM(cal.duration_minutes) AS duration
        FROM
            course_sessions AS cal
        JOIN
            mentee_enrollments AS me ON cal.mentees_id = me.mentees_id
        WHERE
            me.courses_id = ? 
            AND cal.session_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        GROUP BY
            me.mentees_id`,
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
};
module.exports = Statistics;
