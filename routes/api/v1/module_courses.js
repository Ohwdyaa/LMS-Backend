const express = require("express");
const {
  updateModuleCourse,
  createModuleCourse,
  deleteModuleCourse,
  getModuleById,
  getModuleByCourse,
} = require("../../../controllers/module_courses");
const {
  validateMiddleware,
  moduleCourseSchema,
  updateModuleCourseSchema,
} = require("../../../middlewares/validate");
const router = express.Router();

router.post(
  "/moduleCourse",
  validateMiddleware(moduleCourseSchema),
  createModuleCourse
);
router.put(
  "/moduleCourse/:id",
  validateMiddleware(updateModuleCourseSchema),
  updateModuleCourse
);
router.delete("/moduleCourse/:id", deleteModuleCourse);
router.get("/moduleCourse/:id", getModuleById);
router.get("/course/:id/module", getModuleByCourse);

module.exports = router;
