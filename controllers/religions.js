const Religions = require("../models/religions");
const { err } = require("../utils/custom_error");

async function createReligion(req, res) {
  const data = req.body;
  try {
    await Religions.createReligion(data);
    return res.status(201).json({
      message: "Religion created successfully",
    });
  } catch (error) {
    return res.status(err.errorCreate.statusCode).json({
      message: error.message,
      error: err.errorCreate.message,
    });
  }
}

async function getAllReligions(req, res) {
  try {
    const religionData = await Religions.getAllReligion();
    if(religionData.length === 0){
      return res.status(404).json({message: "Religions Not Found"});
    }
    return res.status(200).json({
      data: religionData,
    });
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: error.message,
      error: err.errorSelect.message,
    });
  }
}

module.exports = {
  createReligion,
  getAllReligions,
};
