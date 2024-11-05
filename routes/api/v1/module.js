const express = require("express");
const {
  createModules, updateModule
} = require("../../../controllers/module");
const router = express.Router();

router.post("/module", createModules);
router.put("/module/:module_id", updateModule);
module.exports = router;
