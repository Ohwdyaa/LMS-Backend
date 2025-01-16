const modulePermission = require("../models/module_permissions");
const { err } = require("../utils/custom_error");

async function createModules(req, res) {
  const data = req.body;
  try {
    await modulePermission.createModule(data);
    return res.status(201).json({
      message: "Module created successfully",
    });
  } catch (error) {
    return res.status(err.errorCreate.statusCode).json({
      message: error.message,
      error: err.errorCreate.message,
    });
  }
}

async function getAllModules(req, res) {
  try {
    const modules = await modulePermission.getAllModule();
    if (modules && modules.length > 0) {
      return res.status(200).json({
        data: modules,
      });
    } else {
      return res.status(404).json({
        message: "No modules found",
      });
    }
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: error.message,
      error: err.errorSelect.message,
    });
  }
}

module.exports = {
  createModules,
  getAllModules,
};
