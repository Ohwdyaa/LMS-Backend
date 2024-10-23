const express = require("express");
const {
  createModules,
  getAllModules,
} = require("../../controllers/module_permission");
const router = express.Router();

// router.get("/module", getModuleByCategories);

router.post("/module", createModules);
router.get("/module", getAllModules);
module.exports = router;