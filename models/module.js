const { query2 } = require("../config/db/db");
const { uuid } = require("../utils/tools");

const modulePermission = {
  createModule: async (moduleData, createdByEmail) => {
    const [creator] = await query1("SELECT id, username FROM users WHERE email = ?", [createdByEmail]);
    if (!creator) throw new Error("Creator not found");

    try {
      const uuidModule = uuid();
      const result = await query2(
        `
            INSERT INTO module (
                uuid,
                name,
                position
                category_module_id, 
                created_by
            ) 
                VALUES (?, ?, ?, ?, ?)
            `,
        [uuidModule, moduleData.name, moduleData.position, moduleData.categoryId, creator.id]
      );
      if (result.affectedRows === 0) {
        throw new Error("Role not created, check your input data");
      } return {
        userId: id,
        createdById: creator.id,
        createdByUsername: creator.username,
      };
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
};
module.exports = modulePermission;