const Religions = require("../models/religions");
const { err } = require("../utils/customError");

async function createReligion(req, res) {
  const data = req.body;
  try {
    await Religions.createReligion(data);
    return res.status(201).json({
      message: "Religion created successfully",
    });
  } catch (error) {
    return res.status(err.errorCreate.statusCode).json({
      message: err.errorCreate.message,
      error: error.message,
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
      message: err.errorSelect.message,
      error: error.message,
    });
  }
}

module.exports = {
  createReligion,
  getAllReligions,
};
