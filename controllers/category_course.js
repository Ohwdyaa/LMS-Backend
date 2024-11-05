const { err } = require("../utils/custom_error");
const Categories = require("../models/category_course");


async function createCategories(req, res) {
  const categoriesData = req.body;
  const {id: userId}= req.user;
  try {
    await Categories.createCategories(userId, categoriesData);
    return res.status(201).json({
      message: "Category created successfully"
    });
  } catch (error) {
    return res.status(error.statusCode || err.errorCreate.statusCode).json({
      message: error.message || err.errorCreate.message,
      details: error.details || null,
    });
  }
}
async function updateCategories(req, res){
  const { id: userId } = req.user;
  const { categories_id } = req.params;
  const categoriesData = req.body;
  try {
    await Categories.updateCategory(categoriesData, userId, categories_id);
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

module.exports = {
  createCategories,
  updateCategories
};