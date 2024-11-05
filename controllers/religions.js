const Religions = require("../models/religions");
const { err } = require("../utils/custom_error");

async function createReligion(req, res) {
  const { id: userId } = req.user;
  const data = req.body;
  try {
    await Religions.createReligion(data, userId);
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
async function updateReligion(req, res) {
  const { id: userId } = req.user;
  const {religion_id} = req.params;
  const {name} = req.body;
  try {
    await Religions.updateReligion(religion_id, userId, name);
    return res.status(200).json({
      message: "Religion updated successfully",
    });
  } catch (error) {
    return res.status(err.errorUpdate.statusCode).json({
      message: err.errorUpdate.message,
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
  updateReligion,
};
