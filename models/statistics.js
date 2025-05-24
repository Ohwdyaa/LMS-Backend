const { dbLms } = require("../config/db/db");
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
};
module.exports = Statistics;
