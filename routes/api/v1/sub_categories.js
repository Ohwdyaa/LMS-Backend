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
} = require("../../../middlewares/validate");
const router = express.Router();

router.post(
  "/sub-category",
  validateMiddleware(subCourseCategorySchema),
  createSubCategory
);
router.put("/sub-category/:id", updateSubCategory);
router.delete("/sub-category/:id", deleteSubCategory);
router.get("/sub-category", getAllSubCategories);
// router.get("/sub-category/:id/category", getByCateg);

module.exports = router;
