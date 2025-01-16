const Genders = require("../models/genders");
const { err } = require("../utils/custom_error");

async function createGenders(req, res) {
  const genderData = req.body;
  try {
    await Genders.createGender(genderData);
    return res.status(201).json({
      message: "Gender created successfully",
    });
  } catch (error) {
    res.status(err.errorCreate.statusCode).json({
      message: error.message,
      error: err.errorCreate.message,
    });
  }
}

async function getAllGenders(req, res) {
  try {
    const gender = await Genders.getAllGenders();
    if(gender.length === 0){
      return res.status(404).json({message: "Genders Not Found"});
    }
    return res.status(200).json({
      data: gender,
    });
  } catch (error) {
    res.status(err.errorSelect.statusCode).json({
      message: error.message,
      error: err.errorSelect.message,
    });
  }
}

module.exports = {
  createGenders,
  getAllGenders,
};
