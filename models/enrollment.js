const { lmsManagement } = require("../config/db/db");
const { uuid } = require("../utils/tools");

const Enrollment = {
  enrollMentor: async (data, userId) => {
    try {
      const id = uuid();
      const result = await lmsManagement(
        `INSERT INTO enrollments(
              id, 
              created_by,
              user_id,
              course_id) 
            VALUES (?,?,?,?)`,
        [
          id,
          userId,
          data.userId,
          data.courseId,
        ]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = Enrollment;