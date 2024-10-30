const express = require("express");
const {
  createModules,
} = require("../../../controllers/module");
const router = express.Router();

router.post("/module", createModules);
module.exports = router;
