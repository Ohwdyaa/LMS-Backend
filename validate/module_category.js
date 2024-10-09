const moduleCategory = require("../models/module_category");

async function createCategory(categoryData) {
  try {
    const categoryId = await moduleCategory.createCategory(categoryData);
    return categoryId;
  } catch (error) {
    throw error;
  }
}
module.exports = { createCategory };
