const Enrollment = require("../models/enrollment");
const Users = require("../models/users");
const { err } = require("../utils/custom_error");
 
async function enrollMentor(req, res) { 
  const data = req.body;
  const {id: userId} = req.user;
  try {
    const isMentorExist = await Users.getUserById(data.userId);
    if(isMentorExist === undefined){
      return res.status(400).json({ message: "Mentor not found" });
    }
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
