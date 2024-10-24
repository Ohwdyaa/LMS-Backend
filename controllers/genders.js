const Genders = require("../models/genders");
const { err } = require(`../utils/customError`);

async function createGenders(req, res) {
  const genderData = req.body;
  try {
    await Genders.createGender(genderData);
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

async function getGenderById(req, res) {
  try {
    const gender = await Genders.getGenderById(genderId);
    return gender;
  } catch (error) {
    res.status(err.errorSelect.statusCode).json({
      message: err.errorSelect.message,
      error: error.message,
    });
  }
}
async function getAllGenders(req, res) {
  try {
    const gender = await Genders.getAllGenders();
    return gender;
  } catch (error) {
    res.status(err.errorSelect.statusCode).json({
      message: err.errorSelect.message,
      error: error.message,
    });
  }
}

module.exports = {
  createGenders,
  getGenderById,
  getAllGenders,
};
