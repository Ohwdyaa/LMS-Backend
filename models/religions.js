const { query } = require("../config/db/db");
const { uuid } = require("../utils/tools");
const { err, CustomError } = require("../utils/customError");

const Religions = {
  createReligion: async (religionData) => {
    console.log("Creating role with data:", religionData);
    try {
      const id = uuid();
      const result = await query(
        `
        INSERT INTO religions (
        id,
        name
        ) VALUES (?,?)`,
        [id, religionData.name]
      );
      if (result.length === 0) {
        return null;
      }

      return result;
    } catch (error) {
      throw new CustomError(
        err.dataError.message,
        err.dataError.statusCode
      );
    }
  },
  getReligionById: async (religionId) => {
    try {
      const [result] = await query("SELECT * FROM religions WHERE id = ?", [
        religionId,
      ]);
      if (result.length === 0) {
        return null;
      }
      return result;
    } catch (error) {
      throw new CustomError(
        err.dataError.message,
        err.dataError.statusCode
      );
    }
  },
  getAllReligions: async () => {
      const result = await query("SELECT * FROM religions");
      if (result.length === 0) {
        return null;
    }  return result 
  }, catch (error) {
    throw new CustomError(
      err.dataError.message,
      err.dataError.statusCode
    );
  },
  updateReligion: async (religionId, religionData) => {
    try {
      const result = await query ("UPDATE religions SET ? WHERE id = ?", [
        religionData,
        religionId,
      ]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new CustomError(
        err.failedUpdateReligion.message,
        err.failedUpdateReligion.statusCode
      );
    }
  },
  deleteReligion : async(religionId)=>{
    try {
    const result = await query (" DELETE FROM religions where id = ? ", [religionId]);
      return result;
    } catch (error){
      throw new CustomError(
        err.dataError.message,
        err.dataError.statusCode
      );
    }
  }
};
module.exports = Religions;
