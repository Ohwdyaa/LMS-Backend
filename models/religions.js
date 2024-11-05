const { lmsManagement } = require("../config/db/db");
const { uuid } = require("../utils/tools");
const Users = require("../models/users");

const Religions = {
  createReligion: async (data, userId) => {
    try {
      const id = uuid();
      const result = await lmsManagement(
        `
        INSERT INTO religions (
        id,
        name,
        created_by
        ) VALUES (?,?,?)`,
        [id, data.name, userId]
      );
      return result.insertId;
      }catch (error) {
        console.error("Error creating religion:", error.message);
        throw error;
      }
  },
  updateReligion : async (religion_id, name, userId) => {
  try {
    console.log("User ID:", userId); 
    const result = await lmsManagement(
      `UPDATE religions 
      SET name = ?, 
        updated_at = NOW(),
        updated_by = ?
      WHERE id = ?`,
      [ name, userId, religion_id]
    );
    if (result.affectedRows === 0) {
      throw { statusCode: 404, message: "Religion not found or no changes made" };
    }
    console.log(result)
    return result.insertId;
  }catch (error) {
    console.error("Error updating religion:", error.message);
    throw error;
  }
  },
  getAllReligion: async () => {
    try {
      const result = await lmsManagement("SELECT name FROM religions WHERE is_deleted = 0");
      return result;
    } catch (error) {
      throw error;
    }
  },
};
module.exports = Religions;