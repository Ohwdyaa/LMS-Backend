const express = require("express");
const {
  updateModuleCourse,
  createModuleCourse,
  deleteModuleCourse,
  getAllModulesCourse,
  getModuleById,
} = require("../../../controllers/modules_course");
const router = express.Router();

router.post("/module", createModuleCourse);
router.put("/module/:id", updateModuleCourse);
router.delete("/module/:id", deleteModuleCourse);
router.get("/module", getAllModulesCourse);
router.get("/module/:id", getModuleById);

module.exports = router;