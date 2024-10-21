const { createModule, getAllModule } = require("../validate/module_permission");


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

async function getAllModulesHandler(req, res) {
  try {
    
    const modules = await getAllModule();
    
    if (modules && modules.length > 0) {
      return res.status(200).json({
        success: true,
        data: modules,
        message: 'Modules fetched successfully',
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'No modules found',
      });
    }
  } catch (error) {
    console.error('Error fetching modules:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching modules',
      error: error.message,
    });
  }
}
module.exports = { 

  createModuleHandler,
  getAllModulesHandler

 };
