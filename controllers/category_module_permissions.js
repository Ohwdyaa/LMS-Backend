const moduleCategory = require("../models/category_module_permissions");
const { err } = require("../utils/custom_error");

async function createCategoryModule(req, res) {
  const data = req.body;
  try {
    await moduleCategory.createCategoryModule(data);
    return res.status(201).json({
      message: "Module Category created successfully",
    });
  } catch (error) {
    res.status(err.errorCreate.statusCode).json({
      message: error.message,
      error: err.errorCreate.message,
    });
  }
}

module.exports = { createCategoryModule };
