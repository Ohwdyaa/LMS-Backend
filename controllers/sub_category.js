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
async function updateSubCategory(req, res) {
  const {id: subCategoryId} = req.params;
  const {id: userId} = req.user;
  const data = req.body;
  try {
    const isSubCategoryExist = await subCategory.getSubCategoryById(subCategoryId);
    if (isSubCategoryExist === undefined) {
      return res.status(400).json({ message: "Sub category not found" });
    }
    await subCategory.updateSubCategory(isSubCategoryExist.id, data, userId);
    return res.status(201).json({
      message: "Sub category updated successfully",
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
async function getAllSubCategories(req, res) {
  try {
    const subCategories = await subCategory.getAllSubCategories();
    if (!subCategories || subCategories.length === 0) {
      return res.status(400).json({ message: "No courses found" });
    }
    const subCategoryList = [];
    for (let i = 0; i < subCategories.length; i++) {
      const subCategory = subCategories[i];
      const subCategoryObj = new Object();
      subCategoryObj.id = subCategory.id;
      subCategoryObj.name = subCategory.name;
      subCategoryObj.categories = subCategory.categories;
      subCategoryList.push(subCategoryObj);
    }
    return res.status(200).json({
      data: subCategoryList,
    });
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: err.errorSelect.message,
      error: error.message,
    });
  }
}


module.exports = {
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
  getAllSubCategories
};