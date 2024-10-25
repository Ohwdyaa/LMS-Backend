const express = require("express");
const {
  createModules,
  getAllModules,
  getModuleByCategories,
} = require("../../../controllers/module_permission");
const router = express.Router();

router.get("/module/:id", getModuleByCategories);
router.get("/module", getAllModules);

router.post("/module", createModules);
module.exports = router;
