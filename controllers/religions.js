const Religions = require("../models/religions");

async function createReligion(req, res) {
  const religionData = req.body;
  try {
    const result = await Religions.createReligion(religionData);
    return res.status(201).json({
      message: "Religion created successfully",
      data: { result },
    });
  } catch (error) {
    return res.status(err.internalServerError.statusCode).json({
      message: err.internalServerError.message,
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
    return res.status(404).json({ message: error.message });
  }
}
async function getAllReligions(req, res) {
  try {
    const result = await Religions.getAllReligions();
    return res.status(200).json({
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
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
      message: "Religion updated successfully",
      result,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
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
    return res.status(400).json({ message: error.message });
  }
}

module.exports = {
  createReligion,
  getReligionById,
  getAllReligions,
  updateReligion,
  deleteReligion,
};
