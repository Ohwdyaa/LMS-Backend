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
module.exports = {
  createCategories,
};