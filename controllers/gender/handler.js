const { createGender } = require("./service");
const { errors } = require("../../utils/customError");

async function createGenderHandler(req, res) {
  try {
    const genderData = req.body;

    const genderId = await createGender(genderData);
    return res.status(201).json({
      status: "success",
      message: "Gender created successfully",
      data: { genderId },
    });
  } catch (error) {
    console.error("Error in createGenderHandler:", error);
    return res.status(errors.internalServerError.statusCode).json({
      status: "error",
      message: errors.internalServerError.message,
    });
  }
}

module.exports = {
  createGenderHandler,
};
