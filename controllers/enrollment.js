const Enrollment = require("../models/enrollment");
const { err } = require("../utils/custom_error");
 
async function enrollMentor(req, res) { 
  const data = req.body;
  const {id: userId} = req.user;
  try {
    await Enrollment.enrollMentor(data, userId);
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

module.exports = {
  enrollMentor
};
