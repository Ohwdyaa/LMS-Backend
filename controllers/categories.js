const { err } = require("../utils/custom_error");
const Category = require("../models/categories");

async function createCategory(req, res) {
  const data = req.body;
  const { id: userId } = req.user;
  try {
    await Category.createCategory(data, userId);
    return res.status(201).json({
      message: "Category course created successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || err.errorCreate.statusCode).json({
      message: error.message,
      error: err.errorCreate.message,
    });
  }
}

async function updateCategory(req, res) {
  const { id: categoryId } = req.params;
  const { id: userId } = req.user;
  const data = req.body;
  try {
    const isCategoryExist = await Category.getCategoryById(categoryId);
    if (isCategoryExist === undefined) {
      return res.status(404).json({ message: "Course not found" });
    }

    await Category.updateCategory(isCategoryExist.id, data, userId);
    return res.status(201).json({
      message: "Category updated successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || err.errorCreate.statusCode).json({
      message: error.message,
      error: err.errorUpdate.message,
    });
  }
}

async function deleteCategory(req, res) {
  const { id: categoryId } = req.params;
  try {
    const isCategoryExist = await Category.getByIdCategory(categoryId);
    if (isCategoryExist === undefined) {
      return res.status(404).json({ message: "Category not found" });
    }

    await Category.deleteCategory(isCategoryExist.id);
    return res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    return res.status(err.errorDelete.statusCode).json({
      message: error.message,
      error: err.errorDelete.message,
    });
  }
}

async function getAllCategories(req, res) {
  try {
    const categories = await Category.getAllCategories();
    if (!categories || categories.length === 0) {
      return res.status(404).json({ message: "Categories Not found" });
    }
    const categoryList = [];
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      const categoryObj = new Object();
      categoryObj.id = category.id;
      categoryObj.name = category.name;
      categoryList.push(categoryObj);
    }
    return res.status(200).json({
      data: categoryList,
    });
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: error.message,
      error: err.errorSelect.message,
    });
  }
}

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
};
