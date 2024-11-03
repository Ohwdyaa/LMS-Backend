const { lmsManagement } = require("../config/db/db");
const { uuid } = require("../utils/tools");
const Users = require("../models/users");

const Course = {
  createCourse: async (courseData, creatorEmail) => {
    try {
      const creator = await Users.getUserByEmail(creatorEmail);
      if(creator === undefined || creator=== null){
        throw new Error ('Creator not found');
      }
      creatorId = creator.id;
      creatorUsername = creator.username;
  

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
          creatorId,
          courseData.subCategoryId,
        ]
      );
      console.log("course created : ", {
        id, 
        name : courseData.title,
        created_by : creatorId,
        created_by_username : creatorUsername,
       });
      return result.insertId;
    } catch (error) {
      throw error;
    }
  },
  updateCourse: async (courseId, courseData) => {
    try {
      const result = await lmsManagement(
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