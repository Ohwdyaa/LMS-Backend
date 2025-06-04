const { err } = require("../utils/custom_error");
const contentTypes = require("../models/content_types");

async function createContentTypes(req, res) {
  const data = req.body;
  try {
    await contentTypes.createContentTypes(data);
    return res.status(201).json({
      message: "Content type created successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || err.errorCreate.statusCode).json({
      message: error.message,
      error: err.errorCreate.message,
    });
  }
}
async function getAllContentTypes(req, res) {
  try {
    const data = await contentTypes.getAllContentTypes();
    if (data.length === 0) {
      return res.status(404).json({ message: "Content type not found" });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: error.message,
      error: err.errorSelect.message,
    });
  }
}

module.exports = {
  createContentTypes,
  getAllContentTypes,
};
