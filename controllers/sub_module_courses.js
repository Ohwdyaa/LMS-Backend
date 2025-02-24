const { err } = require("../utils/custom_error");
const subModules = require("../models/sub_module_courses");

async function createSubModule(req, res) {
  const data = req.body;
  const { id: userId } = req.user;
  try {
    await subModules.createSubModule(data, userId);
    return res.status(201).json({
      message: "Sub Modules created successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || err.errorCreate.statusCode).json({
      message: error.message,
      error: err.errorCreate.message,
    });
  }
}

async function updateSubModule(req, res) {
  const { id: subModuleId } = req.params;
  const { id: userId } = req.user;
  const data = req.body;
  try {
    const isSubModuleExist = await subModules.getSubModulesById(subModuleId);
    if (isSubModuleExist === undefined) {
      return res.status(404).json({ message: "Sub modules not found" });
    }

    await subModules.updateSubModule(isSubModuleExist.id, data, userId);
    return res.status(201).json({
      message: "Sub modules updated successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || err.errorUpdate.statusCode).json({
      message: error.message,
      error: err.errorUpdate.message,
    });
  }
}

async function deleteSubModule(req, res) {
  const { id: subModuleId } = req.params;
  try {
    const isSubModuleExist = await subModules.getSubModulesById(subModuleId);
    if (isSubModuleExist === undefined) {
      return res.status(404).json({ message: "sub module not found" });
    }

    await subModules.deleteSubModule(isSubModuleExist.id);
    return res.status(200).json({
      message: "Sub module deleted successfully",
    });
  } catch (error) {
    return res.status(err.errorDelete.statusCode).json({
      message: error.message,
      error: err.errorDelete.message,
    });
  }
}

async function getSubModuleById(req, res) {
  const { id: subId } = req.params;
  try {
    const isSubModuleExist = await subModules.getSubModulesById(subId);
    if (isSubModuleExist === undefined) {
      return res.status(404).json({ message: "Sub modules not found" });
    }
    return res.status(200).json({
      data: isSubModuleExist,
    });
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: error.message,
      error: err.errorSelect.message,
    });
  }
}

async function getSubModuleByModuleCourse(req, res) {
  const { id: moduleId } = req.params;
  try {
    const isSubModuleExist = await subModules.getSubModuleByModuleCourse(
      moduleId
    );
    if (isSubModuleExist.length === 0) {
      return res.status(404).json({ message: "Module not found" });
    }
    return res.status(200).json({
      data: isSubModuleExist,
    });
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: error.message,
      error: err.errorSelect.message,
    });
  }
}

module.exports = {
  createSubModule,
  updateSubModule,
  deleteSubModule,
  getSubModuleById,
  getSubModuleByModuleCourse,
};
