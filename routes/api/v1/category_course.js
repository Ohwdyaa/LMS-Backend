const express = require("express");
const { 
    createCategories, updateCategories 
} = require("../../../controllers/category_course");
const router = express.Router();

router.post("/categories", createCategories);
router.put("/categories/:categories_id", updateCategories);

module.exports = router;
