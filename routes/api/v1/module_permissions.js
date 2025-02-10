const express = require("express");
const { createModules, getAllModules } = require("../../../controllers/module_permissions");
const router = express.Router();

router.post("/module", createModules);
router.get("/module", getAllModules);

module.exports = router;
