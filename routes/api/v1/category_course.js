const express = require("express");
const { createCategory, deleteCategory } = require("../../../controllers/category_course");
const {validateMiddleware, courseCategorySchema, deleteCourseCategorySchema } = require("../../../middlewares/validate");
const router = express.Router();

router.post("/categories", validateMiddleware(courseCategorySchema), createCategory);
router.delete("/categories/:id", validateMiddleware(deleteCourseCategorySchema), deleteCategory);

module.exports = router;
