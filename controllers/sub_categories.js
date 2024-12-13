const { err } = require("../utils/custom_error");
const subCategory = require("../models/sub_categories");
const Mentors = require("../models/mentors");

async function createSubCategory(req, res) {
  const data = req.body;
  const { id: userId } = req.user;
  try {
    await subCategory.createSubCategory(data, userId);
    return res.status(201).json({
      message: "Categories created successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || err.errorCreate.statusCode).json({
      message: error.message,
      error: err.errorCreate.message,
    });
  }
}

async function updateSubCategory(req, res) {
  const { id: subCategoryId } = req.params;
  const { id: userId } = req.user;
  const data = req.body;
  try {
    const isSubCategoryExist = await subCategory.getSubCategoryById(
      subCategoryId
    );
    if (isSubCategoryExist === undefined) {
      return res.status(404).json({ message: "Sub category not found" });
    }
    await subCategory.updateSubCategory(isSubCategoryExist.id, data, userId);
    return res.status(201).json({
      message: "Sub category updated successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || err.errorUpdate.statusCode).json({
      message: error.message,
      error: err.errorUpdate.message,
    });
  }
}

async function deleteSubCategory(req, res) {
  const { id: userId } = req.user;
  const { id: subCategoryId } = req.params;
  try {
    const isSubCategoryExist = await subCategory.getSubCategoryById(
      subCategoryId
    );
    if (isSubCategoryExist === undefined) {
      return res.status(404).json({ message: "Sub category not found" });
    }

    const isChildExist = await Mentors.getMentorsCountBySubCategoryId(
      subCategoryId
    );

    if (isChildExist > 0) {
      return res.status(400).json({
        message: `This data cannot be deleted because it is associated with ${isChildExist} mentor data`,
      });
    }

    await subCategory.softDeleteSubCategory(isSubCategoryExist.id, userId);
    return res.status(200).json({
      message: "Sub category deleted successfully",
    });
  } catch (error) {
    return res.status(err.errorDelete.statusCode).json({
      message: error.message,
      error: err.errorDelete.message,
    });
  }
}

async function getAllSubCategories(req, res) {
  try {
    const subCategories = await subCategory.getAllSubCategories();
    if (!subCategories || subCategories.length === 0) {
      return res.status(404).json({ message: "Sub category not found" });
    }
    return res.status(200).json({
      data: subCategories,
    });
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: error.message,
      error: err.errorSelect.message,
    });
  }
}

module.exports = {
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
  getAllSubCategories,
};
