const express = require("express");
const {
  createSubCategory,
  deleteSubCategory,
  updateSubCategory,
  getAllSubCategories,
} = require("../../../controllers/sub_categories");
const {
  validateMiddleware,
  subCourseCategorySchema,
  deleteSubCourseCategorySchema,
} = require("../../../middlewares/validate");
const router = express.Router();

router.post(
  "/subCategory",
  validateMiddleware(subCourseCategorySchema),
  createSubCategory
);
router.put("/subCategory/:id", updateSubCategory);
router.delete(
  "/subCategory/:id",
  validateMiddleware(deleteSubCourseCategorySchema),
  deleteSubCategory
);
router.get("/subCategory", getAllSubCategories);

module.exports = router;