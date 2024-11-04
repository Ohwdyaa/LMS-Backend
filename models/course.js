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
          courseData.enrollment_key,
          courseData.start_date.courseData.end_date,
          userId,
          courseData.subCategoryId,
        ]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  },
  updateCourse: async (courseId, courseData, updaterEmail) => {
    try {
      const updater = await Users.getUserByEmail(updaterEmail);
      if (updater === undefined || updater === null) {
        throw new Error('Updater not found'); 
      }
      const updatedBy = updater.id; 
      const result = await lmsManagement(
        `UPDATE course SET title = ?, 
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
          courseData.enrollment_key,
          courseData.start_date.courseData.end_date,
          courseData.subCategoryId,
          updatedBy,
          courseId,
        ]
      );
      return result;
    } catch (error) {}
  },
  deleteCourse: async (courseId) => {
    try {
      const result = await lmsManagement(`DELETE FROM course WHERE id=?`, courseId);
      return result;
    } catch (error) {
      throw error;
    }
  },
  getAllCourse: async () => {
    try {
      const result = await lmsManagement(
        `SELECT course.id, 
        course.title, 
        course.description, 
        course.thumbnail, 
        course.start_date, 
        course.end_date, 
        sub_category_id, sub_categories AS subCategories 
        FROM course 
        LEFT JOIN sub_categories ON course.sub_category_id = sub_categories.id`
      );
      return result;
    } catch (error) {throw error}
  },
  getCourseById: async (courseId) => {
    try {
      const result = await lmsManagement(`SELECT course.id, 
        course.title, 
        course.description, 
        course.thumbnail, 
        course.start_date, 
        course.end_date, 
        sub_category_id, sub_categories AS subCategories 
        FROM course 
        LEFT JOIN sub_categories ON course.sub_category_id = sub_categories.id
        WHERE course.id = ?`,[courseId]);
        return result;
    } catch (error) {
      throw error;
    }
  }
};
module.exports = Course;