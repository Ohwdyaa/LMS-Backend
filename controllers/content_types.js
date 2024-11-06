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
module.exports = {
  createContentTypes,
};