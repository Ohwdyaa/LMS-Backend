const express = require("express");
const {
  createCategories, updateCategories,
} = require("../../../controllers/category_module");
const router = express.Router();

router.post("/category", createCategories);
router.put("/category/:module_category_id", updateCategories);

module.exports = router;
