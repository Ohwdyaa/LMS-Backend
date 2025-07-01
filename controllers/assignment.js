const Assign = require("../models/assignment");
const subModule = require("../models/sub_module_courses");
const { err } = require("../utils/custom_error");

async function updateAssignment(req, res) {
  try {
    const { id: subModuleId } = req.params;
    const { id: userId } = req.user;
    const data = req.body;

    const isSubModuleExist = await subModule.getSubModulesById(subModuleId);
    if (isSubModuleExist === 0) {
      return res.status(404).json({ message: "Sub module not found" });
    }

    const isAssignExist = await Assign.getAssignmentBySubModule(subModuleId);
    if (isAssignExist !== undefined) {
      await Assign.updateAssignment(isAssignExist.id, data, userId);
      return res.status(200).json({ message: "Assignment updated successfully" });
    }
    if (isAssignExist === undefined) {
      await Assign.createAssignment(data, userId, subModuleId);
      return res.status(201).json({ message: "Assignment created successfully" });
    }
  } catch (error) {
    return res.status(error.statusCode || err.errorCreate.statusCode).json({
      message: error.message,
      error: err.errorCreate.message,
    });
  }
}

async function getAssignmentBySubModule(req, res) {
  const { id: subModuleId } = req.params;
  try {
    const result = await Assign.getAssignmentBySubModule(subModuleId);
    if (result === undefined) {
      return res.status(404).json({ message: "Assignment not found" });
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
  updateAssignment,
  getAssignmentBySubModule,
};
