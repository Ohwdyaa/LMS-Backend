const modulePermission = require("../models/module_permission");

async function createModule(moduleData) {
  try {
    const moduleId = await modulePermission.createModule(moduleData);
    return moduleId;
  } catch (error) {
    throw error;
  }
}
module.exports = { createModule };
