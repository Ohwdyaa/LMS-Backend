const express = require("express");
const {
  createCategories,
  updateCategories,
} = require("../../controllers/module_category");
const router = express.Router();

router.post("/category", createCategories);
router.put("/category/:id", updateCategories);
module.exports = router;
