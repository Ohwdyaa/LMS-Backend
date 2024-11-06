const express = require("express");
const {
  updateModulesCourse,
  createModulesCourse,
  deleteModulesCourse,
  getAllModulesCourse,
} = require("../../../controllers/modules_course");
const router = express.Router();

router.post("/moduleCourse", createModulesCourse);
router.put("/moduleCourse/:id", updateModulesCourse);
router.delete("/moduleCourse/:id", deleteModulesCourse);
router.get("/moduleCourse", getAllModulesCourse);

module.exports = router;