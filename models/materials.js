const { lmsManagement } = require("../config/db/db");
const { uuid } = require("../utils/tools");


const Materials = {
  createMaterial: async (data, userId) => {
    try {
      const id = uuid();
      const result = await lmsManagement(
        `INSERT INTO course(
          id, 
          content,  
          created_by,
          sub_modules_id) 
        VALUES (?,?,?,?)`,
        [
          id,
          data.content,
          userId,
          data.subModulesId,
        ]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  },
  updateMaterial: async (id, data, userId) => {
    try {
      const result = await lmsManagement(
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
      const result = await lmsManagement(`DELETE FROM courses WHERE id = ?`, id);
      return result;
    } catch (error) {
      throw error;
    }
  },
  getAllMaterials: async () => {
    try {
      const result = await lmsManagement(
        `SELECT 
          id, 
          content,
        FROM materials`
      );
      return result;
    } catch (error) {throw error}
  },
  getMaterialById: async (id) => {
    try {
      const [result] = await lmsManagement(
        `SELECT 
          id, 
          content,
        FROM materials
        WHERE id = ?`,
        [id]
      );
        return result; 
    } catch (error) {
      throw error;
    }
  }
};
module.exports = Materials;