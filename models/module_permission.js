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
  // getModuleByCategory: async (categoryId) => {
  //   try {
  //     const result = await query2(`
  //       SELECT 
  //         m.id, 
  //         m.uuid, 
  //         m.name, 
  //       FROM module m
  //       LEFT JOIN category_module cm
  //         ON m.category_module_id = cm.id
  //       Where
  //         `)
  //   } catch (error) {
      
  //   }
  // }
};
module.exports = modulePermission;