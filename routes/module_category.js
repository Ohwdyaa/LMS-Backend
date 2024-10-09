const express = require("express");
const { createCategoryHandler } = require("../controllers/module_category");
const router = express.Router();

router.post("/category", createCategoryHandler);
module.exports = router;