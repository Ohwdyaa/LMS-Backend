const { err } = require("../utils/custom_error");
const subCategory = require("../models/sub_category");
async function createSubCategory(req, res) {
  const data = req.body;
  const { id: userId } = req.user;
  try {
    await subCategory.createSubCategory(data, userId);
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

async function deleteSubCategory(req, res) {
  const { id: subCategoryId } = req.params;
  try {
    const isSubCategoryExist = await subCategory.getSubCategoryById(subCategoryId);
    if (isSubCategoryExist === undefined) {
      return res.status(400).json({ message: "Sub category not found" });
    }

    await subCategory.deleteSubCategory(isSubCategoryExist.id);
    return res.status(200).json({
      message: "Sub category deleted successfully",
    });
  } catch (error) {
    return res.status(err.errorDelete.statusCode).json({
      message: err.errorDelete.message,
      error: error.message,
    });
  }
}

module.exports = {
  createSubCategory,
  deleteSubCategory
};