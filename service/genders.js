const Genders = require("../models/genders");
const { CustomError, err } = require("../utils/customError");

async function createGender(genderData) {
  try {
    const genderId = await Genders.createGender(genderData);
    return genderId;
  } catch (error) {
    throw new CustomError(
      err.failedGender.message,
      err.failedGender.statusCode
    );
  }
}

async function getGenderById(genderId) {
  try {
    const gender = await Genders.getGenderById(genderId);
    return gender;
  } catch (error) {
    throw new CustomError(err.dataError.message, err.dataError.statusCode);
  }
}
async function getAllGenders() {
  try {
    const allgen = await Genders.getAllGenders();
    return allgen;
  } catch (error) {
    throw new CustomError("Failed to get All Genders", 400);
  }
}

module.exports = {
  createGender,
  getGenderById,
  getAllGenders,
};
