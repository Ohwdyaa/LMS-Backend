const express = require("express");
const { createGender } = require("../controllers/genders");
const router = express.Router();

router.post("/gender", createGender);

module.exports = router;
