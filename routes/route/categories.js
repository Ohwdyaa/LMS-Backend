const express = require("express");
const {
  createCategories
} = require("../../controllers/categories");
const router = express.Router();

router.post("/categories", createCategories);

module.exports = router;