const modulePermission = require("../models/module");
const { err } = require("../utils/custom_error");

async function createModules(req, res) {
  const moduleData = req.body;
  const {id : userId}= req.user;
  try {

    await modulePermission.createModule(moduleData, userId);
    return res.status(201).json({
      message: "Module created successfully",
    });
  } catch (error) {
    return res.status(err.errorCreate.statusCode).json({
      message: err.errorCreate.message,
      error: error.message,
    });
  }
}

async function getAllModules(req, res) {
  try {
    const modules = await modulePermission.getAllModule();
    if (modules && modules.length > 0) {
      return res.status(200).json({
        success: true,
        data: modules,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "No modules found",
      });
    }
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: err.errorSelect.message,
      error: error.message,
    });
  }
}
module.exports = {
  createModules,
  getAllModules,

};
