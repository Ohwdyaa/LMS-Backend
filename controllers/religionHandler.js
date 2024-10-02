const { createReligion } = require("../service/religionService");
const { err } = require("../utils/customError");

async function createReligionHandler(req, res) {
  try {
    const religionData = req.body;

    const religionsId = await createReligion(religionData);
    return res.status(201).json({
      message: "Religion created successfully",
      data: { religionsId },
    });
  } catch (error) {
    console.error("Error in createReligionHandler:", error);
    return res.status(err.internalServerError.statusCode).json({
      message: err.internalServerError.message,
    });
  }
}

module.exports = {
  createReligionHandler,
};
