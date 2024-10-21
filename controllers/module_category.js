const moduleCategory = require("../models/module_category");

async function createCategory(req, res) {
  const categoryData = req.body;
  try {
    const result = await moduleCategory.createCategory(categoryData);
    return res.status(201).json({
      message: "Module created successfully",
      data: { result },
    });
  } catch (error) {
    return res.status(error.statusCode || err.errorCreate.statusCode).json({
      message: error.message || err.errorCreate.message,
      details: error.details || null,
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
    return res.status(error.statusCode || err.errorUpdate.statusCode).json({
      message: error.message || err.errorUpdate.message,
      details: error.details || null,
    });
  }
}

module.exports = { createCategory, updateCategory };
