const { err } = require("../utils/custom_error");
const modulesCourse = require("../models/modules_course");
async function createModulesCourse(req, res) {
  const data = req.body;
  const { id: userId } = req.user;
  try {
    await modulesCourse.createModulesCourse(data, userId);
    return res.status(201).json({
      message: "Module course created successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || err.errorCreate.statusCode).json({
      message: error.message || err.errorCreate.message,
      details: error.details || null,
    });
  }
}
async function updateModulesCourse(req, res) {
  const { id: moduleId } = req.params;
  const { id: userId } = req.user;
  const data = req.body;
  try {
    const isModuleExist = await modulesCourse.getModulesById(moduleId, userId);
    if (isModuleExist === undefined) {
      return res.status(400).json({ message: "Course not found" });
    }

    await modulesCourse.updateModulesCourse(isModuleExist.id, data);
    return res.status(201).json({
      message: "Module course updated successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || err.errorCreate.statusCode).json({
      message: error.message || err.errorCreate.message,
      details: error.details || null,
    });
  }
}

async function deleteModulesCourse(req, res) {
  const { id: moduleId } = req.params;
  try {
    const isModulesExists = await modulesCourse.getModulesById(moduleId);
    if (isModulesExists === undefined) {
      return res.status(400).json({ message: "Modules course not found" });
    }

    await modulesCourse.deleteModulesCourse(isModulesExists.id);
    return res.status(200).json({
      message: "Modules course deleted successfully",
    });
  } catch (error) {
    return res.status(err.errorDelete.statusCode).json({
      message: err.errorDelete.message,
      error: error.message,
    });
  }
}

async function getAllModulesCourse(req, res) {
  try {
    const modules = await modulesCourse.getAllModulesCourse();
    if (!modules || modules.length === 0) {
      return res.status(400).json({ message: "No modules found" });
    }
    const modulesList = [];
    for (let i = 0; i < modules.length; i++) {
      const module = modules[i];
      const moduleObj = new Object();
      moduleObj.id = module.id;
      moduleObj.title = module.title;
      moduleObj.description = module.description;
      moduleObj.course_id = module.courseId;
      modulesList.push(moduleObj);
    }
    return res.status(200).json({
      data: modulesList,
    });
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: err.errorSelect.message,
      error: error.message,
    });
  }
}

module.exports = {
  createModulesCourse,
  updateModulesCourse,
  deleteModulesCourse,
  getAllModulesCourse,
};