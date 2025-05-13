const { err } = require("../utils/custom_error");
const Courses = require("../models/courses");
const generateEnrollmentId = require("../utils/nanoid");
const modulesCourse = require("../models/module_courses");
const Mentees = require("../models/mentees");

async function createCourse(req, res) {
  const data = req.body;
  const { id: userId } = req.user;
  const { thumbnail } = req.files; 
  try {
    let thumbnailUrl = "";
    if (thumbnail) {
      thumbnailUrl = `${req.protocol}://${req.get("host")}/uploads/thumbnail/${thumbnail[0].filename}`;
    }

    const courseData = {
      ...data,
      thumbnail: thumbnailUrl,
    };

    const enrollmentKey = generateEnrollmentId();
    await Courses.createCourse(courseData, userId, enrollmentKey);

    return res.status(201).json({
      message: "Course created successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || err.errorCreate.statusCode).json({
      message: error.message,
      error: err.errorCreate.message,
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
      return res.status(404).json({ message: "Course not found" });
    }

    await Courses.updateCourse(isCourseExist.id, data, userId);
    return res.status(201).json({
      message: "Course updated successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || err.errorCreate.statusCode).json({
      message: error.message,
      error: err.errorUpdate.message,
    });
  }
}

async function deleteCourse(req, res) {
  const { id: courseId } = req.params;
  const { id: userId } = req.user;
  try {
    const isCourseExists = await Courses.getCourseById(courseId);
    if (isCourseExists === undefined) {
      return res.status(404).json({ message: "Course not found" });
    }
    const isChildExist = await modulesCourse.getModulesCountByCourseId(
      isCourseExists.id
    );

    if (isChildExist > 0) {
      return res.status(400).json({
        message: `This data cannot be deleted because it is associated with ${isChildExist} modules`,
      });
    }

    await Courses.softDeleteCourse(isCourseExists.id, userId);

    return res.status(200).json({
      message: "Course deleted successfully",
    });
  } catch (error) {
    return res.status(err.errorDelete.statusCode).json({
      message: error.message,
      error: err.errorDelete.message,
    });
  }
}

async function getAllCourses(req, res) {
  try {
    const courses = await Courses.getAllCourse();
    if (!courses || courses.length === 0) {
      return res.status(404).json({ message: "Courses not found" });
    }
    const courseList = [];
    for (let i = 0; i < courses.length; i++) {
      const course = courses[i];
      const courseObj = new Object();
      courseObj.id = course.id;
      courseObj.title = course.title;
      courseObj.description = course.description;
      courseObj.thumbnail = course.thumbnail;
      courseObj.enrollmentKey = course.enrollment_key;
      courseObj.startDate = course.start_date;
      courseObj.endDate = course.end_date;
      courseList.push(courseObj);
    }
    return res.status(200).json({
      data: courseList,
    });
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: error.message,
      error: err.errorSelect.message,
    });
  }
}

async function getCourseById(req, res) {
  const { id: courseId } = req.params;
  try {
    const isCourseExist = await Courses.getCourseById(courseId);
    if (isCourseExist === undefined) {
      return res.status(404).json({ message: "Course not found" });
    }
    return res.status(200).json({
      data: isCourseExist,
    });
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: error.message,
      error: err.errorSelect.message,
    });
  }
}
async function getCourseByMentee(req, res) {
  const { id: userId } = req.user;
  try {
    const isUserExist = await Mentees.getMenteeById(userId);
    if (isUserExist === undefined || isUserExist.length === 0) {
      return res.status(404).json({ message: "Users not found" });
    }
    const result= await Courses.getCourseByMentee(isUserExist.id);
    return res.status(200).json({
      data: result,
    });
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: error.message,
      error: err.errorSelect.message,
    });
  }
}
module.exports = {
  createCourse,
  updateCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
  getCourseByMentee
};
