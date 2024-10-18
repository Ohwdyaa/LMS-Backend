const { query2 } = require("../config/db/db");
const { uuid } = require("../utils/tools");

const modulePermission = {
  createModule: async (moduleData) => {
    try {
      const uuidModule = uuid();
      const result = await query2(
        `
            INSERT INTO module_permission (
                uuid, 
                name,
                category_module_permissions_id
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
        `SELECT uuid, 
        name, 
        category_module_permissions_id FROM module_permission WHERE id = ?`,
        [module_permission_id.modulePermissionId]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
};
module.exports = modulePermission;
