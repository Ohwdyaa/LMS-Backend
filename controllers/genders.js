const Genders = require("../models/genders");
const { err } = require("../utils/custom_error");

async function createGenders(req, res) {
  const genderData = req.body;
  const {email: userEmail}= req.user;
  try {
    const isUserExists = await Users.getUserByEmail(userEmail);
    if (isUserExists === undefined) {
      return res.status(400).json({ message: "User not found" });
    }
    await Genders.createGender(isUserExists.email, genderData);
    return res.status(201).json({
      message: "Gender created successfully",
    });
  } catch (error) {
    res.status(err.errorCreate.statusCode).json({
      message: err.errorCreate.message,
      error: error.message,
    });
  }
}

async function getAllGenders(req, res) {
  try {
    const gender = await Genders.getAllGenders();
    return res.status(200).json({
      data: gender,
    });
  } catch (error) {
    res.status(err.errorSelect.statusCode).json({
      message: err.errorSelect.message,
      error: error.message,
    });
  }
}

module.exports = {
  createGenders,
  getAllGenders,
};
