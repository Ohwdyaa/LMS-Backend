const express = require("express");
const { createGenders } = require("../../../controllers/genders");
const router = express.Router();

//gender data is static
router.post("/gender", createGenders);

module.exports = router;
