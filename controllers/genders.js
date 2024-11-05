const Genders = require("../models/genders");
const { err } = require("../utils/custom_error");

async function createGenders(req, res) {
  const genderData = req.body;
  const {id : userId}= req.user;
  try {
    await Genders.createGender(genderData, userId);
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
async function updateGender(req, res) {
  const { id: userId } = req.user;
  const {gender_id} = req.params;
  const {name} = req.body;
  try {
    await Genders.updateGender(name, userId, gender_id);
    return res.status(200).json({
      message: "Gender updated successfully",
    });
  } catch (error) {
    return res.status(err.errorUpdate.statusCode).json({
      message: err.errorUpdate.message,
      error: error.message,
    });
  }
}

module.exports = {
  createGenders,
  getAllGenders,
  updateGender
};
