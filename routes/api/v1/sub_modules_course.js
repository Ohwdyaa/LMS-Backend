const express = require("express");
const {
  createSubModule,
  updateSubModule,
  deleteSubModule,
  getAllSubModules,
  getSubModuleById,
} = require("../../../controllers/sub_modules_course");
const router = express.Router();

router.post("/subModule", createSubModule);
router.put("/subModule/:id", updateSubModule);
router.delete("/subModule/:id", deleteSubModule);
router.get("/subModule", getAllSubModules);
router.get("/subModule/:id", getSubModuleById);

module.exports = router;
