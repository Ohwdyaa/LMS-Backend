const express = require("express");
const { createModule, getAllModules } = require("../controllers/module_permission");
const router = express.Router();

router.post("/module", createModule);
router.get("/module", getAllModules );
module.exports = router;