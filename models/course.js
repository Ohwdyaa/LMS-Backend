const { query1 } = require("../config/db/db");
const { uuid } = require("../utils/tools");

const Course = {
  createCourse: async (courseData, createdByEmail) => {
    try {
      const [creator] = await query1("SELECT id, username FROM users WHERE email = ?", [createdByEmail]);
      if (!creator) throw new Error("Creator not found");

      const id = uuid();
      const result = await query1(
        `INSERT INTO course(
        id, 
        title, 
        description, 
        thumbnail, 
        enrollment_key,   
        start_date, 
        end_date, 
        sub_category_id,
        created_by) 
        VALUES 
        (?,?,?,?,?,?,?,?,?)`,
        [
          id,
          courseData.title,
          courseData.description,
          courseData.thumbnail,
          courseData.enrollment_key,
          courseData.start_date.courseData.end_date,
          courseData.subCategoryId,
          creator.id
        ]
      );
      //return result.insertId;
      if (result.affectedRows === 0) {
        throw new Error("Role not created, check your input data");
      } return {
        userId: id,
        createdById: creator.id,
        createdByUsername: creator.username,
      };
    } catch (error) {
      throw error;
    }
  },
  updateCourse: async (courseId, courseData) => {
    try {
      const result = await query1(
        `UPDATE course SET title = ?, 
        description = ?, 
        thumbnail = ?, 
        enrollment_key = ?, 
        start_date = ?, 
        end_date = ?, 
        sub_category_id = ?,
        updated_at = NOW(),
        WHERE id = ?`,
        [
          courseData.title,
          courseData.description,
          courseData.thumbnail,
          courseData.enrollment_key,
          courseData.start_date.courseData.end_date,
          courseData.subCategoryId,
          courseId,
        ]
      );
      return result;
    } catch (error) {}
  },
  deleteCourse: async (courseId) => {
    try {
      const result = await query1(`DELETE FROM course WHERE id=?`, courseId);
      return result;
    } catch (error) {
      throw error;
    }
  },
  getAllCourse: async () => {
    try {
      const result = await query1(
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
      const result = await query1(`SELECT course.id, 
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