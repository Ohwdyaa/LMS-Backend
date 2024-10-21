const express = require("express");
const { createModule } = require("../controllers/module_permission");
const router = express.Router();

router.post("/module", createModule);
module.exports = router;