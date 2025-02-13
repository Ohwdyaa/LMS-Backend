const { err } = require("../utils/custom_error");
const Materials = require("../models/materials");
const subModule = require("../models/sub_module_courses");

async function updateMaterial(req, res) {
  const { id :subModuleId } = req.params;
  const { id: userId } = req.user;
  const data = req.body;
  try {
    const isSubModuleExist = await subModule.getSubModulesById(subModuleId);
    if (isSubModuleExist === undefined) {
      return res.status(404).json({ message: "Sub module not found" });
    }
    const isMaterialExists = await Materials.getMaterialBySubModule(subModuleId);

    if (isMaterialExists) {
      await Materials.updateMaterial(isMaterialExists.id, data, userId);
      return res.status(201).json({
        message: "Material updated successfully",
      });
    }
    if (isMaterialExists === undefined) {
      await Materials.createMaterial(data, userId, isSubModuleExist.id);
      return res.status(201).json({
        message: "Material created successfully",
      });
    }
  } catch (error) {
    return res.status(err.errorUpdate.statusCode).json({
      message: error.message,
      error: err.errorUpdate.message,
    });
  }
}

async function deleteMaterial(req, res) {
  const { id: materialId } = req.params;
  try {
    const isMaterialExist = await Materials.getMaterialById(materialId);
    if (isMaterialExist === undefined) {
      return res.status(404).json({ message: "Material not found" });
    }

    await Materials.deleteMaterial(isMaterialExist.id);
    return res.status(200).json({
      message: "Material deleted successfully",
    });
  } catch (error) {
    return res.status(err.errorDelete.statusCode).json({
      message: error.message,
      error: err.errorDelete.message,
    });
  }
}

async function getMaterialBySubModule(req, res) {
  const { id: subModuleId } = req.params;
  try {
    const isMaterialExist = await Materials.getMaterialBySubModule(subModuleId);
    if (isMaterialExist === undefined) {
      return res.status(404).json({ message: "Material not found" });
    }
    return res.status(200).json({
      data: isMaterialExist,
    });
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: error.message,
      error: err.errorSelect.message,
    });
  }
}

module.exports = {
  updateMaterial,
  deleteMaterial,
  getMaterialBySubModule,
};
