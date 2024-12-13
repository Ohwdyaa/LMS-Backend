const { err } = require("../utils/custom_error");
const modulesCourse = require("../models/module_courses");
const subModules = require("../models/sub_module_courses");

async function createModuleCourse(req, res) {
  const data = req.body;
  const { id: userId } = req.user;
  try {
    await modulesCourse.createModuleCourse(data, userId);
    return res.status(201).json({
      message: "Module course created successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || err.errorCreate.statusCode).json({
      message: error.message,
      error: err.errorCreate.message,
    });
  }
}

async function updateModuleCourse(req, res) {
  const { id: moduleId } = req.params;
  const { id: userId } = req.user;
  const data = req.body;
  try {
    const isModuleExist = await modulesCourse.getModuleById(moduleId, userId);
    if (isModuleExist === undefined) {
      return res.status(404).json({ message: "Course not found" });
    }

    await modulesCourse.updateModuleCourse(isModuleExist.id, data);
    return res.status(201).json({
      message: "Module course updated successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || err.errorCreate.statusCode).json({
      message: error.message,
      error: err.errorCreate.message,
    });
  }
}

async function deleteModuleCourse(req, res) {
  const { id: moduleId } = req.params;
  const { id: userId } = req.user;
  try {
    const isModulesExists = await modulesCourse.getModuleById(moduleId);
    if (isModulesExists === undefined) {
      return res.status(404).json({ message: "Modules course not found" });
    }
    const isChildExist = await subModules.getSubModulesCountByModuleId(
      isModulesExists.id
    );

    if (isChildExist > 0) {
      return res.status(400).json({
        message: `This data cannot be deleted because it is associated with ${isChildExist} sub modules`,
      });
    }

    await modulesCourse.softDeleteModuleCourse(isModulesExists.id, userId);

    return res.status(200).json({
      message: "Modules course deleted successfully",
    });
  } catch (error) {
    return res.status(err.errorDelete.statusCode).json({
      message: error.message,
      error: err.errorDelete.message,
    });
  }
}

async function getModuleById(req, res) {
  const { id: moduleId } = req.params;
  try {
    const isModuleExist = await modulesCourse.getModuleById(moduleId);
    if (isModuleExist === undefined) {
      return res.status(400).json({ message: "Course not found" });
    }
    return res.status(200).json({
      data: isModuleExist,
    });
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: error.message,
      error: err.errorSelect.message,
    });
  }
}

async function getModuleByCourse(req, res) {
  const { id: courseId } = req.params;
  try {
    const isModuleExist = await modulesCourse.getModuleByCourse(courseId);
    if (isModuleExist.length <= 0) {
      return res.status(400).json({ message: "Course not found" });
    }
    return res.status(200).json({
      data: isModuleExist,
    });
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: error.message,
      error: err.errorSelect.message,
    });
  }
}

module.exports = {
  createModuleCourse,
  updateModuleCourse,
  deleteModuleCourse,
  getModuleById,
  getModuleByCourse,
};
