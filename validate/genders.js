const Genders = require("../models/genders");

async function createGender(genderData) {
  try {
    const genderId = await Genders.createGender(genderData);
    return genderId;
  } catch (error) {
    throw new error;
  }
}

async function getGenderById(genderId) {
  try {
    const gender = await Genders.getGenderById(genderId);
    return gender;
  } catch (error) {
    throw new error;
  }
}
async function getAllGenders() {
  try {
    const gender = await Genders.getAllGenders();
    return gender;
  } catch (error) {
    throw new error;
  }
}

module.exports = {
  createGender,
  getGenderById,
  getAllGenders,
};
