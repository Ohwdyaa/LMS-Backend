const express = require("express");
const { createSubCategory, deleteSubCategory } = require("../../../controllers/sub_category");
const { validateMiddleware, subCourseCategorySchema, deleteSubCourseCategorySchema }= require ("../../../middlewares/validate")
const router = express.Router();

router.post("/subCategory", validateMiddleware(subCourseCategorySchema), createSubCategory);
router.delete("/categories/:id", validateMiddleware(deleteSubCourseCategorySchema), deleteSubCategory);

module.exports = router;