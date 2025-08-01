const express = require("express");
const {
  createCategoryModule,
} = require("../../../controllers/category_module_permissions");
const router = express.Router();

router.post("/category", createCategoryModule);

module.exports = router;
