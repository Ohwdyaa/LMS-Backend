const modulePermission = require("../models/module_permission");

async function createModule(req, res) {
  const moduleData = req.body;
  try {
    await modulePermission.createModule(moduleData);
    return res.status(201).json({
      message: "Module created successfully"
    });
  } catch (error) {
    return res.status(error.statusCode || err.errorCreate.statusCode).json({
      message: error.message || err.errorCreate.message,
      details: error.details || null,
    });
  }
}
module.exports = { createModule };
