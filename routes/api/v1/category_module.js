const express = require("express");
const {
  createCategories,
} = require("../../../controllers/category_module");
const router = express.Router();

router.post("/category", createCategories);

module.exports = router;
