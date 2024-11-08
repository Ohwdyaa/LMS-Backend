const express = require("express");
const {
  updateModuleCourse,
  createModuleCourse,
  deleteModuleCourse,
  getModuleById,
  getModuleByCourse,
} = require("../../../controllers/modules_course");
const router = express.Router();

router.post("/moduleCourse", createModuleCourse);
router.put("/moduleCourse/:id", updateModuleCourse);
router.delete("/moduleCourse/:id", deleteModuleCourse);
router.get("/moduleCourse/:id", getModuleById);
router.get("/course/:id/module", getModuleByCourse);

module.exports = router;