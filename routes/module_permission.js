const express = require("express");
const { createModuleHandler } = require("../controllers/module_permission");
const router = express.Router();

router.post("/module", createModuleHandler);
module.exports = router;