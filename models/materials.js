const { dbLms } = require("../config/db/db");
const { mapMySQLError } = require("../utils/custom_error");
const { uuid } = require("../utils/tools");

const Materials = {
  createMaterial: async (data, userId, subModulesId) => {
    try {
      const id = uuid();
      const result = await dbLms(
        `INSERT INTO materials(
          id, 
          content,  
          created_by,
          sub_modules_id) 
        VALUES (?,?,?,?)`,
        [
          id,
          data.content,
          userId,
          subModulesId,
        ]
      );
      return result.insertId;
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },
  updateMaterial: async (id, data, userId) => {
    try {
      const result = await dbLms(
        `UPDATE 
          materials 
        SET 
          content = ?, 
          updated_at = NOW(),
          updated_by = ?
        WHERE id = ?`,
        [
          data.content,
          userId,
          id,
        ]
      );
      return result;
    } catch (error) {}
  },
  deleteMaterial: async (id) => {
    try {
      const result = await dbLms(`DELETE FROM materials WHERE id = ?`, id);
      return result;
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },
  getAllMaterials: async () => {
    try {
      const result = await dbLms(
        `SELECT 
          id, 
          content,
        FROM materials 
        WHERE is_deleted = 0`
      );
      return result;
    } catch (error) {throw error}
  },
  getMaterialById: async (id) => {
    try {
      const [result] = await dbLms(
        `SELECT 
          id, 
          content
        FROM materials
        WHERE id = ?`,
        [id]
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
  getMaterialBySubModule: async (id) => {
    try {
      const [result] = await dbLms(
        `SELECT 
          m.id, 
          m.content, 
          sm.title as subModule 
        FROM materials m
        LEFT JOIN sub_modules sm ON m.sub_modules_id = sm.id 
        WHERE m.sub_modules_id = ?`,
        [id]
      );
        return result; 
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  }
};

module.exports = Materials;