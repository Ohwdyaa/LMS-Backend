const { query2 } = require("../config/db/db");
const { uuid } = require("../utils/tools");

const modulePermission = {
  createModule: async (moduleData) => {
    try {
      const uuidModule = uuid();
      const result = await query2(
        `
            INSERT INTO module (
                uuid, 
                name,
                category_module_id
            ) 
                VALUES (?, ?, ?)
            `,
        [uuidModule, moduleData.name, moduleData.categoryId]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  getModuleById: async (module_permission_id) => {
    try {
      const [result] = await query2(
        `SELECT uuid, name, category_module_id FROM module WHERE id = ?`,
        [module_permission_id.modulePermissionId]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  getAllModule: async () => {
    try {
      const result = await query2(`
        SELECT module.id, 
          module.uuid, 
          module.name, 
          module.category_module_id, 
          category_module.name as categoryModule
        FROM module
        LEFT JOIN category_module 
        ON module.category_module_id = category_module.id`);
      return result;    
    } catch (error) {
      throw error;
    }
  }
};
module.exports = modulePermission;
