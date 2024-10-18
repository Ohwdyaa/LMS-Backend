const express = require("express");
const {
  createCategoriesHandler
} = require("../controllers/categories");
const router = express.Router();

router.post("/categories", createCategoriesHandler);

module.exports = router;