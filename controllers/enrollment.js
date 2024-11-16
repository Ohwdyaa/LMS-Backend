const Enrollment = require("../models/enrollment");
const Mentors = require("../models/mentors");
const { err } = require("../utils/custom_error");
 
async function enrollMentor(req, res) { 
  const {mentorId, courseId} = req.body;
  const {id: userId} = req.user;
  try {
    const isMentorExist = await Mentors.getMentorById(mentorId);
    if(isMentorExist === undefined){
      return res.status(400).json({ message: "Mentor not found" });
    }
    await Enrollment.enrollMentor(courseId, isMentorExist.id, userId);
    return res.status(201).json({
      message: "Enroll mentor successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || err.errorCreate.statusCode).json({
      message: error.message || err.errorCreate.message,
      details: error.details || null,
    });
  }
}

async function unEnroll(req, res) {
  const {id} = req.params;
  try {
    const isEnrollExist = await Enrollment.existingEnroll(id);
    if(isEnrollExist === undefined){
      return res.status(400).json({ message: "Enrollment not found" });
    }
    await Enrollment.unEnroll(isEnrollExist.id);
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
  unEnroll
};