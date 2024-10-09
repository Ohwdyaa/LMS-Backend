const { createModule } = require("../validate/module_permission");

async function createModuleHandler(req, res) {
  try {
    const moduleData = req.body;
    const moduleId = await createModule(moduleData);
    return res.status(201).json({
      message: "Module created successfully",
      data: { moduleId },
    });
  } catch (error) {
    return res.status(error.statusCode || err.errorCreate.statusCode).json({
      message: error.message || err.errorCreate.message,
      details: error.details || null,
    });
  }
}
module.exports = { createModuleHandler };
