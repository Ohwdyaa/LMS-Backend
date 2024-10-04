const express = require("express");
const { createGenderHandler } = require("../controllers/genders");
const router = express.Router();

router.post("/gender", createGenderHandler);

module.exports = router;
