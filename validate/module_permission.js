const modulePermission = require("../models/module_permission");

async function createModule(moduleData) {
  try {
    const moduleId = await modulePermission.createModule(moduleData);
    return moduleId;
  } catch (error) {
    throw error;
  }
}
async function getAllModule(){
  try{
    const modules = await modulePermission.getAllModule();
    return modules;
  }catch (error){
    throw error;
  }
}

module.exports = { createModule, getAllModule };
