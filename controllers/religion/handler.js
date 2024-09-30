const { createReligion } = require("./service");
const { errors } = require("../../utils/customError");

async function createReligionHandler(req, res) {
  try {
    const religionData = req.body;

    const religionsId = await createReligion(religionData);
    return res.status(201).json({
      status: "success",
      message: "Religion created successfully",
      data: { religionsId },
    });
  } catch (error) {
    console.error("Error in createReligionHandler:", error);
    return res.status(errors.internalServerError.statusCode).json({
      status: "error",
      message: errors.internalServerError.message,
    });
  }
}

module.exports = {
  createReligionHandler,
};
