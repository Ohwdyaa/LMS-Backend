const express = require("express");
const {
  createModules,
} = require("../../../controllers/module");
const router = express.Router();

// router.get("/module/:id", getModuleByCategories);
// router.get("/module", getAllModules);

router.post("/module", createModules);
module.exports = router;
