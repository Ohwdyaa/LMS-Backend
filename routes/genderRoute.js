const express = require("express");
const { createGenderHandler } = require("../controllers/genderHandler");
const router = express.Router();

router.post("/gender", createGenderHandler);

module.exports = router;