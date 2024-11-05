const { err } = require("../utils/custom_error");
const subCategory = require("../models/sub_category");
async function createSubCategory(req, res) {
  const data = req.body;
  try {
    await subCategory.createSubCategory(data);
    return res.status(201).json({
      message: "Categories created successfully"
    });
  } catch (error) {
    return res.status(error.statusCode || err.errorCreate.statusCode).json({
      message: error.message || err.errorCreate.message,
      details: error.details || null,
    });
  }
}

module.exports = {
  createSubCategory,
};