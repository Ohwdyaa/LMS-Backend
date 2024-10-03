const Religions = require("../models/religions");
const { CustomError, err } = require("../utils/customError");

async function createReligion(religionData) {
    try {
        const religionId = await Religions.createReligion(religionData);
        return religionId;
    } catch (error) {
        throw new CustomError(
            err.failedReligion.message,
            err.failedReligion.statusCode
        );
    }
}
async function getReligionById(religionId) {
    try {
        const religion = await Religions.getReligionById(religionId);
        if (!religion) {
            throw new CustomError('Religion not found', 404);
        }
        return religion;
    } catch (error) {
        throw new CustomError('Failed to get religion', 400);
    }
}
async function getAllReligions() {
    try {
        const reli = await Religions.getAllReligions();
        return reli;
    } catch (error) {
        throw new CustomError('Failed to get all religions', 400);
    }
}
async function updateReligion(religionId, religionData) {
    try {
      const relig = await Religions.getReligionById(religionId, religionData);
      if (relig.affectedRows === 0) {
        throw Error(" Religion not found or no changes made");
      }
      await Religions.updateReligion(religionId, religionData);
    } catch (error) {
      throw new CustomError(
        err.failedUpdateReligion.message,
        err.failedUpdateReligion.statusCode
      );
    }
  }
async function deleteReligion(religionId){
    try {
        const hapus = await Religions.deleteReligion(religionId);
        return hapus;
    }catch (error){
     throw new CustomError ('Failed to delete religion', 400);
    }
}

module.exports = {
    createReligion,
    getReligionById,
    getAllReligions,
    updateReligion,
    deleteReligion
}