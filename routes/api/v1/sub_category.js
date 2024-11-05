const express = require("express");
const { createSubCategory } = require("../../../controllers/sub_category");
const router = express.Router();

router.post("/subCategory", createSubCategory);

module.exports = router;