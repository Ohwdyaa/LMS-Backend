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
module.exports = {
    createClass,
};
