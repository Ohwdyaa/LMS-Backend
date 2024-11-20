const { err } = require("../utils/custom_error");
const Courses = require("../models/courses");
const generateEnrollmentId = require("../utils/nanoid");
const Enrollments = require("../models/enrollments");
async function createCourse(req, res) {
  const data = req.body;
  const { id: userId } = req.user;
  try {
    const enrollmentKey = generateEnrollmentId();
    await Courses.createCourse(data, userId, enrollmentKey);
    return res.status(201).json({
      message: "Course created successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || err.errorCreate.statusCode).json({
      message: error.message || err.errorCreate.message,
      details: error.details || null,
    });
  }
}
async function updateCourse(req, res) {
  const { id: courseId } = req.params;
  const { id: userId } = req.user;
  const data = req.body;
  try {
    const isCourseExist = await Courses.getCourseById(courseId);
    if (isCourseExist === undefined) {
      return res.status(400).json({ message: "Course not found" });
    }

    await Courses.updateCourse(isCourseExist.id, data, userId);
    return res.status(201).json({
      message: "Course updated successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || err.errorCreate.statusCode).json({
      message: error.message || err.errorCreate.message,
      details: error.details || null,
    });
  }
}
async function deleteCourse(req, res) {
  const { id: courseId } = req.params;
  try {
    const isCourseExists = await Courses.getCourseById(courseId);
    if (isCourseExists === undefined) {
      return res.status(400).json({ message: "Course not found" });
    }

    await Courses.deleteCourse(isCourseExists.id);
    return res.status(200).json({
      message: "Course deleted successfully",
    });
  } catch (error) {
    return res.status(err.errorDelete.statusCode).json({
      message: err.errorDelete.message,
      error: error.message,
    });
  }
}
async function getAllCourses(req, res) {
  try {
    const courses = await Courses.getAllCourse();
    if (!courses || courses.length === 0) {
      return res.status(400).json({ message: "No courses found" });
    }
    const courseList = [];
    for (let i = 0; i < courses.length; i++) {
      const course = courses[i];
      const courseObj = new Object();
      courseObj.id = course.id;
      courseObj.title = course.title;
      courseObj.description = course.description;
      courseObj.thumbnail = course.thumbnail;
      courseObj.enrollment_key = course.enrollment_key;
      courseObj.start_date = course.start_date;
      courseObj.end_date = course.end_date;
      courseList.push(courseObj);
    }
    return res.status(200).json({
      data: courseList,
    });
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: err.errorSelect.message,
      error: error.message,
    });
  }
}
async function getCourseById(req, res) {
  const { id: courseId } = req.params;
  try {
    const isCourseExist = await Courses.getCourseById(courseId);
    if (isCourseExist === undefined) {
      return res.status(400).json({ message: "Course not found" });
    }
    return res.status(200).json({
      data: isCourseExist,
    });
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: err.errorSelect.message,
      error: error.message,
    });
  }
}
async function getCourseParticipants(req, res) {
  const { id: courseId } = req.params;
  try {
    const isUserExist = await Enrollments.getCourseParticipants(courseId);
    if (isUserExist === undefined) {
      return res.status(400).json({ message: "Users not found" });
    }
    return res.status(200).json({
      data: isUserExist,
    });
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: err.errorSelect.message,
      error: error.message,
    });
  }
}
module.exports = {
  createCourse,
  updateCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
  getCourseParticipants,
};
