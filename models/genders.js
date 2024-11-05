const { lmsManagement } = require("../config/db/db");
const { uuid } = require("../utils/tools");
const Users = require("../models/users");

const Genders = {
  createGender: async (genderData, userId) => {
    try {
      const id = uuid();
      const result = await lmsManagement(
        `
        INSERT INTO genders (
        id,
        name,
        created_by
        ) VALUES (?, ?, ?)`,
        [id, genderData.name, userId]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  getAllGenders: async () => {
    try {
      const result = await lmsManagement(" SELECT name FROM genders");
      return result;
    } catch (error) {
      throw error;
    }
  },
  updateGender : async (name, userId, gender_id) => {
    try {
      console.log("User ID:", userId); 
      const result = await lmsManagement(
        `UPDATE genders
        SET name = ?, 
          updated_at = NOW(),
          updated_by = ?
        WHERE id = ?`,
        [ name, userId, gender_id]
      );
      if (result.affectedRows === 0) {
        throw { statusCode: 404, message: "Gender not found or no changes made" };
      }
      console.log(result)
      return result.insertId;
    }catch (error) {
      console.error("Error updating religion:", error.message);
      throw error;
    }
}
};

module.exports = Genders;
