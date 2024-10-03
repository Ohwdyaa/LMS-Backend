const { query } = require("../config/db/db");
const { uuid } = require("../utils/tools");
const { err, CustomError } = require("../utils/customError");

const Genders = {
  createGender: async (genderData) => {
    console.log("Creating role with data:", genderData);
    try {
      const id = uuid();
      const result = await query(
        `
        INSERT INTO genders (
        id,
        name
        ) VALUES (?,?)`,
        [id, genderData.name]
      );
      if (result.length === 0) {
        return null;
      }

      return result;
    } catch (error) {
      throw new CustomError(err.dataError.message, err.dataError.statusCode);
    }
  },
  getGenderById: async (genderId) => {
    try {
      const [result] = await query("SELECT * FROM genders WHERE id = ?", [
        genderId,
      ]);
      if (result.length === 0) {
        return null;
      }

      return result;
    } catch (error) {
      throw new CustomError(err.dataError.message, err.dataError.statusCode);
    }
  },
  getAllGenders: async () => {
    try {
      const gen = await query(" SELECT * FROM genders ");
      if (gen.length === 0) {
        return null;
      }
      return gen;
    } catch (error) {
      throw new CustomError(err.dataError.message, err.dataError.statusCode);
    }
  },
  updateGender: async (genderId, genderData) => {
    try {
      const updategen = await query("SELECT FROM genders WHERE id = ?", [
        genderId,
        genderData,
      ]);
      if (updategen.length === 0) {
        return null;
      }
      return updategen;
    } catch (error) {
      throw new CustomError(err.dataError.message, err.dataError.statusCode);
    }
  },
  deleteGender: async (genderId) => {
    try {
      const hapus = await query("DELETE FROM genders WHERE id = ?", genderId);
      return hapus;
    } catch (error) {
      throw new CustomError(err.dataError.message, err.dataError.message);
    }
  },
};

module.exports = Genders;
