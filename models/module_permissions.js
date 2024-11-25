const {  modulePages } = require("../config/db/db");
const { mapMySQLError } = require("../utils/custom_error");
const { uuid } = require("../utils/tools");

const modulePermission = {
  createModule: async (data) => {
    try {
      const uuidModule = uuid();
      const result = await modulePages(
        `INSERT INTO module 
          (uuid, 
          name,
          category_module_id) 
        VALUES (?, ?, ?)`,
        [uuidModule, data.name, data.categoryId]);
      return result;
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },
  getModuleById: async (module_id) => {
    try {
      const [result] = await modulePages(
        `SELECT uuid, name, category_module_id FROM module WHERE id = ?`,
        [module_id.modulePermissionId]
      );
      return result;
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },
  getAllModule: async () => {
    try {
      const result = await modulePages(`
        SELECT 
          m.id, 
          m.uuid, 
          m.name, 
          m.category_module_id, 
          cm.name as categoryModule
        FROM module m
        LEFT JOIN category_module cm
        ON m.category_module_id = cm.id 
        WHERE m.is_visible = 1`);
      return result;
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },
};

module.exports = modulePermission;