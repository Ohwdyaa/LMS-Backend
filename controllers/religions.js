const Religions = require("../models/religions");
const { err } = require("../utils/customError");

async function createReligion(req, res) {
  const religionData = req.body;
  try {
    const result = await Religions.createReligion(religionData);
    return res.status(201).json({
      message: "Religion created successfully"
    });
  } catch (error) {
    res.status(err.errorCreate.statusCode).json({
      message: err.errorCreate.message,
      error: error.message
    });
  }
}
async function getReligionById(req, res) {
  const { id } = req.params;
  try {
    const result = await Religions.getReligionById(id);
    if (result === undefined) {
      throw new CustomError("Religion not found");
    }
    return res.status(200).json(result);
  } catch (error) {
    res.status(err.errorSelect.statusCode).json({
      message: err.errorSelect.message,
      error: error.message
    });
  }
}
async function getAllReligions(req, res) {
  try {
    const result = await Religions.getAllReligions();
    return res.status(200).json({
      data: result,
    });
  } catch (error) {
    res.status(err.errorSelect.statusCode).json({
      message: err.errorSelect.message,
      error: error.message
    });
  }
}
async function updateReligion(req, res) {
  const { id: religionId } = req.params;
  const religionData = req.body;
  try {
    const religion = await Religions.getReligionById(religionId, religionData);
    if (religion === undefined) {
      throw error;
    }
    await Religions.updateReligion(religionId, religionData);
    return res.status(200).json({
      message: "Religion updated successfully"
    });
  } catch (error) {
    res.status(err.errorUpdate.statusCode).json({
      message: err.errorUpdate.message,
      error: error.message
    });
  }
}
async function deleteReligion(req, res) {
  const religionId = req.params.id;
  try {
    await Religions.deleteReligion(religionId);
    return res.status(200).json({
      message: "Religion deleted successfully",
    });
  } catch (error) {
    res.status(err.errorDelete.statusCode).json({
      message: err.errorDelete.message,
      error: error.message
    });
  }
}

module.exports = {
  createReligion,
  getReligionById,
  getAllReligions,
  updateReligion,
  deleteReligion,
};
