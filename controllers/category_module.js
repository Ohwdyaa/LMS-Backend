const moduleCategory = require("../models/category_module");
const { err } = require("../utils/custom_error");


async function createCategories(req, res) {
  const data = req.body;
  const {email: userEmail}= req.user;
  try {
    await moduleCategory.createCategory(data, userEmail);
    return res.status(201).json({
      message: "Module created successfully",
    });
  } catch (error) {
    res.status(err.errorCreate.statusCode).json({
      message: err.errorCreate.message,
      error: error.message,
    });
  }
}

module.exports = { createCategories };
