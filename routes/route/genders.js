const express = require("express");
const { createGenders } = require("../../controllers/genders");
const router = express.Router();

router.post("/gender", createGenders);

module.exports = router;
