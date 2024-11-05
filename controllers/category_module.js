const moduleCategory = require("../models/category_module");
const { err } = require("../utils/custom_error");

async function createCategories(req, res) {
  const data = req.body;
  const { id: userId } = req.user;
  try {
    await moduleCategory.createCategory(data, userId);
    return res.status(201).json({
      message: "Module Category created successfully",
    });
  } catch (error) {
    res.status(err.errorCreate.statusCode).json({
      message: err.errorCreate.message,
      error: error.message,
    });
  }
}
async function updateCategories(req, res) {
  const { id: userId } = req.user;
  const { module_category_id } = req.params;
  const { name } = req.body;
  try {
    await moduleCategory.updateCategory(name, userId, module_category_id);
    return res.status(200).json({
      message: "Modul Category updated successfully",
    });
  } catch (error) {
    return res.status(err.errorUpdate.statusCode).json({
      message: err.errorUpdate.message,
      error: error.message,
    });
  }
}

module.exports = { createCategories, updateCategories };
