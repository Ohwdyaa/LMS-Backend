const Enrollments = require("../models/enrollments");
const Courses = require("../models/courses");
const { err } = require("../utils/custom_error");

async function enrollMentor(req, res) {
  const { id: courseId } = req.params;
  const { mentorId } = req.body;
  const { id: userId } = req.user;
  try {
    const isCourseExist = await Courses.getCourseById(courseId);
    if (isCourseExist === undefined) {
      return res.status(400).json({
        message: "Invalid course ID",
      });
    }
    const isEnrollExist = await Enrollments.existingEntry(
      isCourseExist.id,
      mentorId
    );
    if (isEnrollExist !== undefined) {
      await Enrollments.updateEnroll(isEnrollExist.id, userId);
      return res.status(201).json({
        message: "Mentor is active",
      });
    }
    if (isEnrollExist === undefined) {
      await Enrollments.enrollMentor(courseId, mentorId, userId);
      return res.status(201).json({
        message: "Enroll mentor successfully",
      });
    }
  } catch (error) {
    return res.status(error.statusCode || err.errorCreate.statusCode).json({
      message: error.message,
      error: err.errorRequest.message,
    });
  }
}

async function unEnroll(req, res) {
  const { id } = req.params;
  const { id: userId } = req.user;
  try {
    const isEnrollExist = await Enrollments.existingEnroll(id);
    if (isEnrollExist === undefined) {
      return res.status(404).json({ message: "Enrollment not found" });
    }
    await Enrollments.unEnroll(isEnrollExist.id, userId);
    return res.status(200).json({
      message: "Un enroll successfully",
    });
  } catch (error) {
    return res.status(err.errorDelete.statusCode).json({
      message: error.message,
      error: err.errorRequest.message,
    });
  }
}

module.exports = {
  enrollMentor,
  unEnroll,
};
