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
  updateModule : async (name, userId, module_id) => {
    try {
      console.log("User ID:", userId); 
      const result = await lmsModule(
       `UPDATE module
        SET name = ?, 
          updated_at = NOW(),
          updated_by = ?
        WHERE id = ?`,
        [name, userId, module_id]
      );
      if (result.affectedRows === 0) {
        throw { statusCode: 404, message: "Modul not found or no changes made" };
      }
      console.log(result)
    }catch (error) {
      console.error("Error updating Module:", error.message);
      throw error;
    }
    },
};
module.exports = modulePermission;