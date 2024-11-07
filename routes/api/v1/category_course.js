const express = require("express");
const { createCategory, deleteCategory } = require("../../../controllers/category_course");
const router = express.Router();

router.post("/categories", createCategory);
router.delete("/categories/:id", deleteCategory);

module.exports = router;
