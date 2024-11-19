const Enrollment = require("../models/enrollment");
const Course = require("../models/course");
const { err } = require("../utils/custom_error");

async function enrollMentor(req, res) {
  const { id: courseId } = req.params;
  const { mentorId } = req.body;
  const { id: userId } = req.user;
  try {
    const isCourseExist = await Course.getCourseById(courseId);
    if (isCourseExist === undefined) {
      return res.status(400).json({
        message: "Invalid course ID",
      });
    }  
    const isEnrollExist = await Enrollment.existingEntry(isCourseExist.id, mentorId);
    if (isEnrollExist !== undefined) {
      await Enrollment.updateEnroll(isEnrollExist.id, userId);
      return res.status(201).json({
        message: "Mentor is active",
      });
    }
    if (isEnrollExist === undefined) {
      await Enrollment.enrollMentor(courseId, mentorId, userId);
      return res.status(201).json({
        message: "Enroll mentor successfully",
      });
    }
  } catch (error) {
    return res.status(error.statusCode || err.errorCreate.statusCode).json({
      message: error.message || err.errorCreate.message,
      details: error.details || null,
    });
  }
}

async function unEnroll(req, res) {
  const { id } = req.params;
  const { id: userId } = req.user;
  try {
    const isEnrollExist = await Enrollment.existingEnroll(id);
    if (isEnrollExist === undefined) {
      return res.status(400).json({ message: "Enrollment not found" });
    }
    await Enrollment.unEnroll(isEnrollExist.id, userId);
    return res.status(200).json({
      message: "Un enroll successfully",
    });
  } catch (error) {
    return res.status(err.errorDelete.statusCode).json({
      message: err.errorDelete.message,
      error: error.message,
    });
  }
}

module.exports = {
  enrollMentor,
  unEnroll,
};
