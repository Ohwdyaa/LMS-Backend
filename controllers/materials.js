const { err } = require("../utils/custom_error");
const Materials = require("../models/materials");

async function createMaterial(req, res) {
  const data = req.body;
  const { id: userId } = req.user;
  try {
    await Materials.createMaterial(data, userId);
    return res.status(201).json({
      message: "Material created successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || err.errorCreate.statusCode).json({
      message: error.message || err.errorCreate.message,
      details: error.details || null,
    });
  }
}

async function updateMaterial(req, res) {
  const { id: materialId } = req.params;
  const { id: userId } = req.user;
  const data = req.body;
  try {
    const isMaterialExist = await Materials.getMaterialById(materialId);
    if (isMaterialExist === undefined) {
      return res.status(400).json({ message: "Material not found" });
    }

    await Materials.updateMaterial(isMaterialExist.id, data, userId);
    return res.status(201).json({
      message: "Material updated successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || err.errorCreate.statusCode).json({
      message: error.message || err.errorCreate.message,
      details: error.details || null,
    });
  }
}

async function deleteMaterial(req, res) {
  const { id: materialId } = req.params;
  try {
    const isMaterialExist = await Materials.getMaterialById(materialId);
    if (isMaterialExist === undefined) {
      return res.status(400).json({ message: "Material not found" });
    }

    await Materials.deleteMaterial(isMaterialExist.id);
    return res.status(200).json({
      message: "Material deleted successfully",
    });
  } catch (error) {
    return res.status(err.errorDelete.statusCode).json({
      message: err.errorDelete.message,
      error: error.message,
    });
  }
}

async function getMaterialById(req, res) {
  const { id: materialId } = req.params;
  try {
    const isMaterialExist = await Materials.getMaterialById(materialId);
    if (isMaterialExist === undefined) {
      return res.status(400).json({ message: "Material not found" });
    }
    return res.status(200).json({
      data: isMaterialExist,
    });
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: err.errorSelect.message,
      error: error.message,
    });
  }
}
module.exports = {
  createMaterial,
  updateMaterial,
  deleteMaterial,
  getMaterialById
};
