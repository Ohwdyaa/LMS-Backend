const { dbLms, dbMentee } = require("../config/db/db");
const { mapMySQLError } = require("../utils/custom_error");

const Statistics = {
  // Metrik 1: Menghitung total mentee di satu kursus
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

  // Metrik 2: Mengambil semua skor di satu kursus untuk diolah
  // Kita akan pakai utils/statistics.js Anda di sini!
  getAllScoresByCourse: async (courseId) => {
    try {
      const result = await dbMentee(
        `SELECT e.score 
         FROM evaluation e
         JOIN mentee_enrollments en ON e.mentees_id = en.mentees_id
         WHERE en.courses_id = ?`,
        [courseId]
      );
      // Mengembalikan array of scores, contoh: [80, 90, 75, ...]
      return result;
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },

  // Metrik 3: Menghitung jumlah mentee yang dianggap 'at-risk'
  // ASUMSI: at-risk jika rata-rata skor < 65
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

  // Metrik 4: Menghitung mentee yang aktif (login) dalam 7 hari terakhir
  countActiveMentees: async (courseId) => {
    try {
      const result = await dbMentee(
        `SELECT COUNT(DISTINCT mentees_id) AS activeCount 
         FROM course_sessions
         WHERE courses_id = ? AND start_time >= DATE_SUB(NOW(), INTERVAL 7 DAY)`,
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
  // Fungsi untuk mengambil SEMUA data skor untuk satu kursus
  getAllStudentScores: async (courseId) => {
    try {
      const result = await dbMentee(
        // Menggunakan dbMentee karena terkait data mentee
        `SELECT
                me.mentees_id,
                m.fullname as menteeName,
                e.score
            FROM evaluation e
            JOIN mentee_enrollments me ON e.mentees_id = me.mentees_id
            JOIN mentees m ON me.mentees_id = m.id
            WHERE me.courses_id = ?;`,
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

  // Fungsi untuk mengambil SEMUA data engagement (durasi)
  getAllStudentEngagements: async (courseId) => {
    try {
      const result = await dbMentee(
        // Menggunakan dbMentee karena terkait data mentee
        `SELECT
                me.mentees_id,
                TIMESTAMPDIFF(MINUTE, cal.start_time, cal.end_time) AS duration
            FROM course_sessions cal
            JOIN mentee_enrollments me ON cal.mentees_id = me.mentees_id
            WHERE me.courses_id = ?;`,
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
