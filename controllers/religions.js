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
async function getReligionById(req, res) {
  const { id: religionId } = req.params;
  try {
    const religion = await Religions.getReligionById(religionId);
    if (religion === undefined) {
      throw new Error("Religion not found");
    }
    return res.status(200).json(religion);
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: err.errorSelect.message,
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
async function updateReligions(req, res) {
  const { id: religionId } = req.params;
  const newValue = req.body;
  try {
    const religion = await Religions.getReligionById(religionId);
    if (religion === undefined) {
      throw new Error("Religion not found");
    }
    await Religions.updateReligion(religionId, newValue);
    return res.status(200).json({
      message: "Religion updated successfully",
    });
  } catch (error) {
    res.status(err.errorUpdate.statusCode).json({
      message: err.errorUpdate.message,
      error: error.message,
    });
  }
}
async function deleteReligions(req, res) {
  const { id: religionId } = req.params;
  try {
    await Religions.deleteReligion(religionId);
    return res.status(200).json({
      message: "Religion deleted successfully",
    });
  } catch (error) {
    res.status(err.errorDelete.statusCode).json({
      message: err.errorDelete.message,
      error: error.message,
    });
  }
}

module.exports = {
  createReligion,
  getReligionById,
  getAllReligions,
  updateReligions,
  deleteReligions,
};
