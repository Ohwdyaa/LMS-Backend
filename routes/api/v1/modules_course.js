const express = require("express");
const {
  updateModuleCourse,
  createModuleCourse,
  deleteModuleCourse,
  getAllModulesCourse,
  getModuleById,
  getModuleByCourse,
} = require("../../../controllers/modules_course");
const router = express.Router();

router.post("/moduleCourse", createModuleCourse);
router.put("/moduleCourse/:id", updateModuleCourse);
router.delete("/moduleCourse/:id", deleteModuleCourse);
router.get("/moduleCourse", getAllModulesCourse);
router.get("/moduleCourse/:id", getModuleById);
router.get("/moduleCourse/course/:id", getModuleByCourse);

module.exports = router;