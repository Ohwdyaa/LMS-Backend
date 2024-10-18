const { createCategories } = require(`../validate/categories`)
const { err } = require("../utils/customError");

async function createCategoriesHandler(req, res) {
    try {
        const categoriesData = req.body;
        const categoriesId = await createCategories(categoriesData);
        return res.status(201).json({
            message: "User created successfully",
            data: { categoriesId },
          });
    } catch (error) {
        return res.status(error.statusCode || err.errorCreate.statusCode).json({
            message: error.message || err.errorCreate.message,
            details: error.details || null,
          });
    }
}
module.exports = {
    createCategoriesHandler,
  };