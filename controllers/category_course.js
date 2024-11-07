const { err } = require("../utils/custom_error");
const Category = require("../models/category_course");

async function createCategory(req, res) {
  const data = req.body;
  const {id: userId}= req.user;
  try {
    await Category.createCategory(data, userId);
    return res.status(201).json({
      message: "Category course created successfully"
    });
  } catch (error) {
    return res.status(error.statusCode || err.errorCreate.statusCode).json({
      message: error.message || err.errorCreate.message,
      details: error.details || null,
    });
  }
}

async function deleteCategory(req, res) {
  const { id: categoryId } = req.params;
  try {
    const isCategoryExist = await Category.getByIdCategory(categoryId);
    if (isCategoryExist === undefined) {
      return res.status(400).json({ message: "Category not found" });
    }

    await Category.deleteCategory(isCategoryExist.id);
    return res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    return res.status(err.errorDelete.statusCode).json({
      message: err.errorDelete.message,
      error: error.message,
    });
  }
}

module.exports = {
  createCategory,
  deleteCategory
};