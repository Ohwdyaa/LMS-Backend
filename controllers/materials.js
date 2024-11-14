const { err } = require("../utils/custom_error");
const Materials = require("../models/materials");
const subModule = require("../models/sub_modules_course");

async function updateMaterial(req, res) {
  const { id } = req.params;
  const { id: userId } = req.user;
  const data = req.body;
  try {
    const isSubModuleExist = await subModule.getSubModulesById(id);
    if (isSubModuleExist === undefined) {
      return res.status(400).json({ message: "Sub module not found" });
    }
    const isExists = await Materials.getMaterialBySubModule(id);
    if(isExists){
      await Materials.updateMaterial(isExists.id, data, userId);
      return res.status(201).json({
        message: "Material updated successfully",
      });
    }
    if (isExists === undefined) {
      await Materials.createMaterial(data, userId);
      return res.status(201).json({
        message: "Material created successfully",
      });
    }
  } catch (error) {
    return res.status(err.errorUpdate.statusCode).json({
      message: err.errorUpdate.message,
      error: error.message,
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
  updateMaterial,
  deleteMaterial,
  getMaterialById
};
