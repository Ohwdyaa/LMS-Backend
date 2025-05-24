const Project = require("../models/projects");
const subModule = require("../models/sub_module_courses");
const { err } = require("../utils/custom_error");

async function updateProject(req, res) {
  try {
    const { id: subModuleId } = req.params;
    const { id: userId } = req.user;
    const data = req.body;
    console.log(userId);
    const isSubModuleExist = await subModule.getSubModulesById(subModuleId);
    console.log(isSubModuleExist);
    if (isSubModuleExist === 0) {
      return res.status(404).json({ message: "Sub module not found" });
    }

    const isProjectExist = await Project.getProjectBySubModule(subModuleId);
    if (isProjectExist !== undefined) {
      await Project.updateProject(isProjectExist.id, data, userId);
      return res.status(200).json({ message: "Project updated successfully" });
    }
    if (isProjectExist === undefined) {
      await Project.createProject(data, userId, subModuleId);
      return res.status(201).json({ message: "Project created successfully" });
    }
  } catch (error) {
    return res.status(error.statusCode || err.errorCreate.statusCode).json({
      message: error.message,
      error: err.errorCreate.message,
    });
  }
}

async function getProjectBySubModule(req, res) {
  const { id: subModuleId } = req.params;
  try {
    const result = await Project.getProjectBySubModule(subModuleId);
    if (!result) {
      return res.status(404).json({ message: "Project not found" });
    }
    return res.status(200).json({ data: result });
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: error.message,
      error: err.errorSelect.message,
    });
  }
}

module.exports = {
  updateProject,
  getProjectBySubModule,
};
