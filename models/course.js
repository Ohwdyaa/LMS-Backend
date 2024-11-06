const { lmsManagement } = require("../config/db/db");
const { uuid } = require("../utils/tools");


const Course = {
  createCourse: async (courseData, userId) => {
    try {
      const id = uuid();
      const result = await lmsManagement(
        `INSERT INTO course(
        id, 
        title, 
        description, 
        thumbnail, 
        enrollment_key,   
        start_date, 
        end_date, 
        created_by,
        sub_category_id) 
        VALUES 
        (?,?,?,?,?,?,?,?,?)`,
        [
          id,
          courseData.title,
          courseData.description,
          courseData.thumbnail,
          courseData.enrollmentKey,
          courseData.startDate,
          courseData.endDate
        ]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  },
  updateCourse: async (courseId, courseData, userId) => {
    try {
      const result = await lmsManagement(
        `UPDATE courses SET title = ?, 
        description = ?, 
        thumbnail = ?, 
        enrollment_key = ?, 
        start_date = ?, 
        end_date = ?, 
        sub_category_id = ?,
        updated_at = NOW(),
        updated_by = ?,
        WHERE id = ?`,
        [
          courseData.title,
          courseData.description,
          courseData.thumbnail,
          courseData.enrollmentKey,
          courseData.startDate,
          courseData.endDate,
          courseId,
        ]
      );
      return result;
    } catch (error) {}
  },
  deleteCourse: async (courseId) => {
    try {
      const result = await lmsManagement(`DELETE FROM courses WHERE id=?`, courseId);
      return result;
    } catch (error) {
      throw error;
    }
  },
  getAllCourse: async () => {
    try {
      const result = await lmsManagement(
        `SELECT 
          id, 
          title, 
          description, 
          thumbnail, 
          start_date, 
          end_date
        FROM courses`
      );
      return result;
    } catch (error) {throw error}
  },
  getCourseById: async (id) => {
    try {
      console.log("id", id)
      const [result] = await lmsManagement(
        `SELECT 
          id, 
          title, 
          'description', 
          thumbnail, 
          start_date, 
          end_date
        FROM courses
        WHERE id = ?`,
        [id]
      );
        console.log("result", result)
        return result; 
    } catch (error) {
      throw error;
    }
  }
};
module.exports = Course;