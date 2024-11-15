const express = require("express");
const { createCategory, deleteCategory, updateCategory } = require("../../../controllers/category_course");
const {validateMiddleware, courseCategorySchema, deleteCourseCategorySchema } = require("../../../middlewares/validate");
const router = express.Router();

router.post("/categories", validateMiddleware(courseCategorySchema), createCategory);4
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", validateMiddleware(deleteCourseCategorySchema), deleteCategory);

module.exports = router;