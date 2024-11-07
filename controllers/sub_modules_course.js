const { err } = require("../utils/custom_error");
const subModules = require("../models/sub_modules_course");
async function createSubModules(req, res) {
  const data = req.body;
  const {id : userId} = req.user;
  try {
    await subModules.createSubModules(data, userId);
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
async function updateSubModules(req, res) {
  const { id: subModuleId } = req.params;
  const data = req.body;
  const { id: userId } = req.user;
  try {
    const isSubModuleExist = await subModules.getByIdSubModules(subModuleId);
    if (isSubModuleExist === undefined) {
      return res.status(400).json({ message: "Sub modules not found" });
    }

    await subModules.updateSubModules(isSubModuleExist.id, data, userId);
    return res.status(201).json({
      message: "Sub modules updated successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || err.errorUpdate.statusCode).json({
      message: error.message || err.errorUpdate.message,
      details: error.details || null,
    });
  }
}

async function deleteSubModules(req, res) {
  const { id: subModuleId } = req.params;
  try {
    const isSubModuleExist = await subModules.getByIdSubModules(subModuleId);
    if (isSubModuleExist === undefined) {
      return res.status(400).json({ message: "User not found" });
    }

    await subModules.deleteSubModules(isSubModuleExist.id);
    return res.status(200).json({
      message: "Sub module deleted successfully",
    });
  } catch (error) {
    return res.status(err.errorDelete.statusCode).json({
      message: err.errorDelete.message,
      error: error.message,
    });
  }
}
async function getAllSubModules(req, res) {
  try {
    const subModuleCourse = await subModules.getAllSubModules();
    if (!subModuleCourse || subModuleCourse.length === 0) {
      return res.status(400).json({ message: "No sub modules found" });
    }
    const subModuleList = [];
    for (let i = 0; i < subModuleCourse.length; i++) {
      const sub = subModuleCourse[i];
      const subObj = new Object();
      subObj.id = sub.id;
      subObj.title = sub.title;
      subObj.description = sub.description;
      subObj.moduleCourseId = sub.moduleCourseId;
      subObj.contentTypeId = sub.contentTypeId;
      subModuleList.push(subObj);
    }
    return res.status(200).json({
      data: subModuleList,
    });
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: err.errorSelect.message,
      error: error.message,
    });
  }
}

module.exports = {
  createSubModules,
  updateSubModules,
  deleteSubModules,
  getAllSubModules
};
