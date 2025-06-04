const Mentees = require("../models/mentees");
const { hashPassword } = require("../utils/bcrypt");
const { err } = require("../utils/custom_error");

async function createMentee(req, res) {
  try {
    const { id: userId } = req.user;
    const { profileImage } = req.files;
    const { email } = req.body;

    const isUserExist = await Mentees.getMenteeByEmail(email);
    if (isUserExist) {
      let message;
      if (isUserExist.email.toLowerCase() === email.toLowerCase()) {
        message = "Email already registered";
      }
      return res.status(400).json({
        message,
      });
    }

    const profileImageUrl = profileImage
      ? `${req.protocol}://${req.get("host")}/uploads/profile-mentees/${
          profileImage[0].filename
        }`
      : "";

    const password = "112233";
    const hash = await hashPassword(password);
    const menteeData = {
      ...req.body,
      password: hash,
      profileImage: profileImageUrl,
    };
    await Mentees.createMentee(menteeData, userId);
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
async function updateMentee(req, res) {
  try {
    const { id: userId } = req.user;
    const { id: menteeId } = req.params;

    const isUserExists = await Mentees.getMenteeById(menteeId);
    if (isUserExists === undefined) {
      return res.status(404).json({ message: "User not found" });
    }
    await Mentees.updateMentee(isUserExists.id, req.body, userId);
    return res.status(200).json({
      message: "User updated successfully",
    });
  } catch (error) {
    return res.status(err.errorUpdate.statusCode).json({
      message: error.message,
      error: err.errorUpdate.message,
    });
  }
}
async function getAllMentees(req, res) {
  try {
    const mentees = await Mentees.getAllMentee();
    if (mentees.length === 0) {
      return res.status(404).json({ message: "Mentees not found" });
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
async function getMenteeDetail(req, res) {
  const { id: menteeId } = req.params;
  try {
    const isUserExists = await Mentees.getMenteeDetail(menteeId);
    if (isUserExists === undefined) {
      return res.status(404).json({ message: "User not found" });
    }
    const { password, ...menteeDetails } = isUserExists;
    return res.status(200).json({
      data: menteeDetails,
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
  updateMentee,
  getAllMentees,
  getMenteeDetail,
};
