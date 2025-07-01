const { dbLms, dbMentee } = require("../config/db/db");
const { mapMySQLError } = require("../utils/custom_error");

const Statistics = {
  getAllModulesStatistics: async () => {
    try {
      const results = await dbLms(
        `
        SELECT 
            ans.is_correct
        FROM answers ans
        LEFT JOIN questions qs ON ans.questions_id = qs.id
        LEFT JOIN quizzes qz ON qs.quizzes_id = qz.id
        LEFT JOIN sub_modules sm ON qz.sub_modules_id = sm.id
        LEFT JOIN module_courses m ON sm.module_course_id = m.id
        WHERE m.id = ?
        AND ans.is_deleted = 0
        `,
        [id]
      );
    } catch (error) {}
  },
  getScoresByModule: async (id) => {
    try {
      const results = await dbLms(
        `
        SELECT 
            ans.is_correct
        FROM answers ans
        LEFT JOIN questions qs ON ans.questions_id = qs.id
        LEFT JOIN quizzes qz ON qs.quizzes_id = qz.id
        LEFT JOIN sub_modules sm ON qz.sub_modules_id = sm.id
        LEFT JOIN module_courses m ON sm.module_course_id = m.id
        WHERE m.id = ?
        AND ans.is_deleted = 0
        `,
        [id]
      );

      var scores = [];
      for (var i = 0; i < results.length; i++) {
        scores.push(Number(results[i].is_correct));
      }
      return scores;
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },
  getMenteeErrorsByModule: async (id) => {
    const results = await dbLms(
      `
    SELECT 
      mnt.id AS mentee_id,
      mnt.fullname,
      COUNT(ans.id) AS total_questions,
      SUM(CASE WHEN ans.is_correct = 0 THEN 1 ELSE 0 END) AS wrong_answers
    FROM answers ans
    LEFT JOIN questions qs ON ans.questions_id = qs.id
    LEFT JOIN quizzes qz ON qs.quizzes_id = qz.id
    LEFT JOIN sub_modules sm ON qz.sub_modules_id = sm.id
    LEFT JOIN module_courses mc ON sm.module_course_id = mc.id
    LEFT JOIN mentee_management.mentees mnt ON ans.mentees_id = mnt.id
    WHERE mc.id = ?
      AND ans.is_deleted = 0
    GROUP BY mnt.id
    `,
      [id]
    );
    return results;
  },

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
          mc.name AS moduleName,
          e.score, 
          e.mentees_id
        FROM evaluation e
        JOIN assignment_submissions asub ON e.assign_submission_id = asub.id
        JOIN assignments a ON asub.assignment_id = a.id
        JOIN sub_modules sm ON a.sub_module_id = sm.id
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
          mc.name AS moduleName,
          e.score, 
          e.mentees_id
        FROM evaluation e
        JOIN quizzes q ON e.quizzes_id = q.id
        JOIN sub_modules sm ON q.sub_module_id = sm.id
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
};
module.exports = Statistics;
