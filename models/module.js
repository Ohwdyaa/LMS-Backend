const { lmsModule } = require("../config/db/db");
const { uuid } = require("../utils/tools");

const modulePermission = {
  createModule: async (moduleData, userId) => {
    try {
      const id = uuid();
      const result = await lmsModule(
        `
            INSERT INTO module (
                uuid, 
                name,
                created_by,
                category_module_id
            ) 
                VALUES (?, ?, ?, ?)
            `,
        [id, moduleData.name, userId, moduleData.categoryId]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  getModuleById: async (module_permission_id) => {
    try {
      const [result] = await lmsModule(
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
      const result = await lmsModule(`
        SELECT 
          m.id, 
          m.uuid, 
          m.name, 
          m.category_module_id, 
          cm.name as categoryModule
        FROM module m
        LEFT JOIN category_module cm
        ON m.category_module_id = cm.id`);
      return result;    
    } catch (error) {
      throw error;
    }
  }, 

};
module.exports = modulePermission;