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
    const isEnrollExist = await Enrollments.existingMentor(
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
async function enrollMenteeByKey(req, res) {
  const { id: courseId } = req.params;
  const { menteeId, enrollmentKey } = req.body;
  const { id: userId } = req.user;

  try {
    const isCourseExist = await Courses.getCourseById(courseId);
    console.log(isCourseExist);
    if (isCourseExist === undefined) {
      return res.status(400).json({
        message: "Invalid course ID",
      });
    }
    if (isCourseExist.enrollment_key !== enrollmentKey) {
      return res.status(400).json({
        message: "Enrollment key does not match",
      });
    }
    const isEnrollExist = await Enrollments.existingMentee(
      isCourseExist.id,
      menteeId
    );
    if (isEnrollExist !== undefined) {
      return res.status(400).json({
        message: "Mentees are already enrolled in this course",
      });
    }
    await Enrollments.enrollMentee(courseId, menteeId, userId);
    return res.status(201).json({
      message: "Mentee successfully registered",
    });
  } catch (error) {
    return res.status(error.statusCode || error.errorCreate.statusCode).json({
      message: error.message,
      error: error.errorRequest.message,
    });
  }
}
async function enrollMentee(req, res) {
  const { id: courseId } = req.params;
  const { menteeId } = req.body;
  const { id: userId } = req.user;
  try {
    const isCourseExist = await Courses.getCourseById(courseId);
    if (isCourseExist === undefined) {
      return res.status(400).json({
        message: "Invalid course ID",
      });
    }
    const isEnrollExist = await Enrollments.existingMentee(
      isCourseExist.id,
      menteeId
    );
    if (isEnrollExist !== undefined) {
      await Enrollments.updateEnroll(isEnrollExist.id, userId);
      return res.status(201).json({
        message: "Mentee are already enrolled in this course",
      });
    }
    if (isEnrollExist === undefined) {
      await Enrollments.enrollMentee(courseId, menteeId, userId);
      return res.status(201).json({
        message: "Enroll mentee successfully",
      });
    }
  } catch (error) {
    return res.status(error.statusCode || err.errorCreate.statusCode).json({
      message: error.message,
      error: err.errorRequest.message,
    });
  }
}
async function getMentorByCourse(req, res) {
  const { id: courseId } = req.params;
  try {
    const isUserExist = await Enrollments.getMentorByCourse(courseId);
    if (isUserExist === undefined || isUserExist.length === 0) {
      return res.status(404).json({ message: "Users not found" });
    }
    return res.status(200).json({
      data: isUserExist,
    });
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: error.message,
      error: err.errorSelect.message,
    });
  }
}
async function getMenteeByCourse(req, res) {
  const { id: courseId } = req.params;
  try {
    const isUserExist = await Enrollments.getMenteeByCourse(courseId);
    if (isUserExist === undefined || isUserExist.length === 0) {
      return res.status(404).json({ message: "Users not found" });
    }
    return res.status(200).json({
      data: isUserExist,
    });
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: error.message,
      error: err.errorSelect.message,
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
  enrollMenteeByKey,
  enrollMentee,
  unEnroll,
  getMentorByCourse,
  getMenteeByCourse,
};
