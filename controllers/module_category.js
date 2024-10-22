const moduleCategory = require("../models/module_category");
const {err} = require(`../utils/customError`);

async function createCategory(req, res) {
  const categoryData = req.body;
  try {
    const result = await moduleCategory.createCategory(categoryData);
    return res.status(201).json({
      message: "Module created successfully",
      data: { result },
    });
  } catch (error) {
    res.status(err.errorCreate.statusCode).json({
      message: err.errorCreate.message,
      error: error.message
    });
  }
}
async function updateCategory(req, res) {
  const categoryId = req.params;
  const categoryData = req.body;
  try {
    const category = await moduleCategory.getCategoryById(categoryId);
    if (category === undefined) {
      throw new Error("Category not found");
    }
    await moduleCategory.updateCategory(categoryId, categoryData);
    return res.status(200).json({
      message: "Category updated successfully"
    });
  } catch (error) {
    res.status(err.errorUpdate.statusCode).json({
      message: err.errorUpdate.message,
      error: error.message
    });
  }
}

module.exports = { createCategory, updateCategory };
