const moduleCategory = require("../models/module_category");
const {err} = require(`../utils/customError`);

async function createCategories(req, res) {
  const data = req.body;
  try {
    await moduleCategory.createCategory(data);
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
async function updateCategories(req, res) {
  const {id: categoryId} = req.params;
  const newValue = req.body;
  try {
    const category = await moduleCategory.getCategoryById(categoryId);
    if (category === undefined) {
      throw new Error("Category not found");
    }
    await moduleCategory.updateCategory(categoryId, newValue);
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

module.exports = { createCategories, updateCategories };
