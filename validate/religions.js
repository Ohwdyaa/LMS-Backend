const Religions = require("../models/religions");

async function createReligion(religionData) {
  try {
    const religionId = await Religions.createReligion(religionData);
    return religionId;
  } catch (error) {
    throw error;
  }
}
async function getReligionById(religionId) {
  try {
    const religion = await Religions.getReligionById(religionId);
    if (religion === undefined) {
      throw new CustomError("Religion not found");
    }
    return religion;
  } catch (error) {
    throw error;
  }
}
async function getAllReligions() {
  try {
    const religion = await Religions.getAllReligions();
    return religion;
  } catch (error) {
    throw error;
  }
}
async function updateReligion(religionId, religionData) {
  try {
    const religion = await Religions.getReligionById(religionId, religionData);
    if (relig.affectedRows === 0) {
      throw error;
    }
    await Religions.updateReligion(religionId, religionData);
    return religion;
  } catch (error) {
    throw error;
  }
}
async function deleteReligion(religionId) {
  try {
    const deleteReligions = await Religions.deleteReligion(religionId);
    return deleteReligions;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createReligion,
  getReligionById,
  getAllReligions,
  updateReligion,
  deleteReligion,
};
