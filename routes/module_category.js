const express = require("express");
const {
  createCategory,
  updateCategory,
} = require("../controllers/module_category");
const router = express.Router();

router.post("/category", createCategory);
router.put("/category/:id", updateCategory);
module.exports = router;
