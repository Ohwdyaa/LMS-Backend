const express = require("express");
const { createReligionHandler } = require("../controllers/religionHandler");
const router = express.Router();

router.post("/religion", createReligionHandler);

module.exports = router;