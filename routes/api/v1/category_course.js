const express = require("express");
const { createCategories } = require("../../../controllers/category_course");
const router = express.Router();

router.post("/categories", createCategories);

module.exports = router;
