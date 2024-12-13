const Religions = require("../models/religions");
const { err } = require("../utils/custom_error");

async function createReligion(req, res) {
  const data = req.body;
  try {
    await Religions.createReligion(data, userId);
    return res.status(201).json({
      message: "Religion created successfully",
    });
  } catch (error) {
    return res.status(err.errorCreate.statusCode).json({
      message: error.message,
      error: err.errorCreate.message,
    });
  }
}

async function getAllReligions(req, res) {
  try {
    const religion = await Religions.getAllReligion();
    return res.status(200).json({
      data: religion,
    });
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: error.message,
      error: err.errorSelect.message,
    });
  }
}

module.exports = {
  createReligion,
  getAllReligions,
};
