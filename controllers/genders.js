const Genders = require("../models/genders");

async function createGender(req, res) {
  const genderData = req.body;
  try {
    await Genders.createGender(genderData);
    return res.status(201).json({
      message: "Gender created successfully"
    });
  } catch (error) {
    return res.status(err.internalServerError.statusCode).json({
      message: err.internalServerError.message,
    });
  }
}

async function getGenderById(req, res) {
  try {
    const gender = await Genders.getGenderById(genderId);
    return gender;
  } catch (error) {
    throw error;
  }
}
async function getAllGenders(req, res) {
  try {
    const gender = await Genders.getAllGenders();
    return gender;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createGender,
  getGenderById,
  getAllGenders,
};
