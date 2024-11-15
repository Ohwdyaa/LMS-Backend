const express = require("express");
const { createSubCategory, deleteSubCategory, updateSubCategory } = require("../../../controllers/sub_category");
const { validateMiddleware, subCourseCategorySchema, deleteSubCourseCategorySchema }= require ("../../../middlewares/validate")
const router = express.Router();

router.post("/subCategory", validateMiddleware(subCourseCategorySchema), createSubCategory);
router.put("/subCategory/:id", updateSubCategory);
router.delete("/subCategory/:id", validateMiddleware(deleteSubCourseCategorySchema), deleteSubCategory);

module.exports = router;