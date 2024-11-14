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
      message: error.message || err.errorCreate.message,
      details: error.details || null,
    });
  }
}
async function getAllContentTypes(req, res) {
  try {
    const data = await contentTypes.getAllContentTypes();

    return res.status(200).json(data);
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: err.errorSelect.message,
      error: error.message,
    });
  }
}
module.exports = {
  createContentTypes,
  getAllContentTypes
};