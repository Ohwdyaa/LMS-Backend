const Question = require("../models/questions");
const { err } = require("../utils/custom_error");

async function createLevel(req, res) {
  try {
    const { id: userId } = req.user;
    const data = req.body;

    const existingLevel = await Level.getLevelByName(data.name);
    if (existingLevel.length > 0) {
      return res
        .status(400)
        .json({ message: "A level with this name already exists" });
    }

    await Level.createLevel(data, userId);
    return res.status(201).json({
      message: "Level created successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || err.errorCreate.statusCode).json({
      message: error.message,
      error: err.errorCreate.message,
    });
  }
}
module.exports = {
  createLevel,
};
