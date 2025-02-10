const express = require("express");
const { createLevel } = require("../../../controllers/levels");
const router = express.Router();

router.post("/levels", createLevel);

module.exports = router;