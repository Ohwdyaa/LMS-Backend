const express = require("express");
const {
  createCategory,
  deleteCategory,
  updateCategory,
  getAllCategories,
} = require("../../../controllers/categories");
const {
  validateMiddleware,
  courseCategorySchema,
  deleteCourseCategorySchema,
} = require("../../../middlewares/validate");
const router = express.Router();

router.post(
  "/categories",
  validateMiddleware(courseCategorySchema),
  createCategory
);
router.put("/categories/:id", updateCategory);
router.delete(
  "/categories/:id",
  validateMiddleware(deleteCourseCategorySchema),
  deleteCategory
);
router.get("/categories", getAllCategories);

module.exports = router;
