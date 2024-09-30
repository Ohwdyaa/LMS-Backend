const express = require("express");
const { createReligionHandler } = require("./handler");
const router = express.Router();

router.post("/religion", createReligionHandler);

module.exports = router;