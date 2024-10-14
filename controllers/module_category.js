const { createCategory } = require("../validate/module_category");

async function createCategoryHandler(req, res) {
  try {
    const categoryData = req.body;
    const categoryId = await createCategory(categoryData);
    return res.status(201).json({
      message: "Module created successfully",
      data: { categoryId },
    });
  } catch (error) {
    return res.status(error.statusCode || err.errorCreate.statusCode).json({
      message: error.message || err.errorCreate.message,
      details: error.details || null,
    });
  }
}
module.exports = { createCategoryHandler };
