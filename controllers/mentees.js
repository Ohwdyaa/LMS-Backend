const Mentees = require("../models/mentees");
const { hashPassword } = require("../utils/bcrypt");
const { err } = require("../utils/custom_error");

async function createMentee(req, res) {
  try {
    const { id: userId } = req.user;
    const data = req.body;
    const password = "112233";

    const isUserExist = await Mentees.getMenteeByEmail(data.email);
    if (isUserExist) {
      let message;
      if (isUserExist.email.toLowerCase() === data.email.toLowerCase()) {
        message = "Email already registered";
      }
      return res.status(400).json({
        message,
      });
    }
    const hash = await hashPassword(password);
    const userData = {
      ...data,
      password: hash
    };
    await Mentees.createMentee(userData, userId);
    return res.status(201).json({
      message: "User created successfully",
    });
  } catch (error) {
    return res.status(err.errorCreate.statusCode).json({
      message: error.message,
      error: err.errorCreate.message,
    });
  }
}
async function getAllMentees(req, res) {
  try {
    const mentees = await Mentees.getAllMentee();
    if (!mentees || mentees.length === 0) {
      return res.status(404).json({ message: "Users not found" });
    }
    return res.status(200).json({
      data: mentees,
    });
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: error.message,
      error: err.errorSelect.message,
    });
  }
}
module.exports = {
  createMentee,
  getAllMentees
};
