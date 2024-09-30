const express = require("express");
const { createGenderHandler } = require("./handler");
const router = express.Router();

router.post("/create_gender", createGenderHandler);

module.exports = router;