const Class = require("../models/class");
const { err } = require("../utils/custom_error");

async function createClass(req, res) {
  try {
    const { id: userId } = req.user;
    const { name } = req.body;

    const isClassExist = await Class.getClassByName(name);
    if (isClassExist === undefined) {
      await Class.createClass(name, userId);
      return res.status(201).json({
        message: "Class created successfully",
      });
    } else {
      return res.status(400).json({
        message: "Class is exist",
      });
    }
  } catch (error) {
    return res.status(error.statusCode || err.errorCreate.statusCode).json({
      message: error.message,
      error: err.errorCreate.message,
    });
  }
}
async function getAllClass(req, res) {
  try {
    const data = await Class.getAllClass();
    if (data === undefined || data.length === 0) {
      return res.status(404).json({ message: "Class not found" });
    }
    return res.status(200).json({ data: data });
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: error.message,
      error: err.errorSelect.message,
    });
  }
}
module.exports = {
  createClass,
  getAllClass,
};
