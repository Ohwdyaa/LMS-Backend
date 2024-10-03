const { createGender } = require("../validate/genders");
const { err } = require("../utils/customError");

async function createGenderHandler(req, res) {
  try {
    const genderData = req.body;

    const genderId = await createGender(genderData);
    return res.status(201).json({
      message: "Gender created successfully",
      data: { genderId },
    });
  } catch (error) {
    console.error("Error in createGenderHandler:", error);
    return res.status(err.internalServerError.statusCode).json({
      message: err.internalServerError.message,
    });
  }
}

module.exports = {
  createGenderHandler,
};
