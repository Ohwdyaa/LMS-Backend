const Religions = require("../models/religions");
const { CustomError, err } = require("../utils/customError");

async function createReligion(religionData) {
  try {
    const religionId = await Religions.createReligion(religionData);
    return religionId;
  } catch (error) {
    throw new error;
  }
}
async function getReligionById(religionId) {
  try {
    const religion = await Religions.getReligionById(religionId);
    if (!religion) {
      throw new CustomError("Religion not found", 404);
    }
    return religion;
  } catch (error) {
    throw new error;
  }
}
async function getAllReligions() {
  try {
    const religion = await Religions.getAllReligions();
    return religion;
  } catch (error) {
    throw new error;
  }
}
async function updateReligion(religionId, religionData) {
  try {
    const religion = await Religions.getReligionById(religionId, religionData);
    if (relig.affectedRows === 0) {
      throw Error(" Religion not found or no changes made");
    }
    await Religions.updateReligion(religionId, religionData);
    return religion;
  } catch (error) {
    throw new error;
  }
}
async function deleteReligion(religionId) {
  try {
    const deleteReligions = await Religions.deleteReligion(religionId);
    return deleteReligions;
  } catch (error) {
    throw new error;
  }
}

module.exports = {
  createReligion,
  getReligionById,
  getAllReligions,
  updateReligion,
  deleteReligion,
};
