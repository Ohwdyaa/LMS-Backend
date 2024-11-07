const express = require("express");
const { createSubCategory, deleteSubCategory } = require("../../../controllers/sub_category");
const router = express.Router();

router.post("/subCategory", createSubCategory);
router.delete("/categories/:id", deleteSubCategory);

module.exports = router;