const { err } = require("../utils/custom_error");
const Categories = require("../models/category_course");
async function createCategories(req, res) {
  const categoriesData = req.body;
  const {email: userEmail}= req.user;
  try {
    const isUserExists = await Users.getUserByEmail(userEmail);
    if (isUserExists === undefined) {
      return res.status(400).json({ message: "User not found" });
    }
    await Categories.createCategories(isUserExists.email, categoriesData);
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

module.exports = {
  createCategories,
};