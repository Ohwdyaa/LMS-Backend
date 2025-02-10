const Genders = require("../models/genders");
const { err } = require("../utils/custom_error");

async function createGenders(req, res) {
  const data = req.body;
  try {
    await Genders.createGender(data);
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
    const genderData = await Genders.getAllGenders();
    if(genderData.length === 0){
      return res.status(404).json({message: "Genders Not Found"});
    }
    return res.status(200).json({
      data: genderData,
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
