const express = require("express");
const { createModuleHandler, getAllModulesHandler } = require("../controllers/module_permission");
const router = express.Router();

router.post("/module", createModuleHandler);
router.get("/module", getAllModulesHandler );
module.exports = router;