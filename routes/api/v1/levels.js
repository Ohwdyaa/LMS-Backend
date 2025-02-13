const express = require("express");
const { createLevel, getAllLevels } = require("../../../controllers/levels");
const router = express.Router();

router.post("/level", createLevel);
router.get("/level", getAllLevels);

module.exports = router; 