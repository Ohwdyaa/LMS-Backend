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
  "/module-course",
  validateMiddleware(moduleCourseSchema),
  createModuleCourse
);
router.put(
  "/module-course/:id",
  validateMiddleware(updateModuleCourseSchema),
  updateModuleCourse
);
router.delete("/module-course/:id", deleteModuleCourse);
router.get("/module-course/:id", getModuleById);
router.get("/course/:id/module-course", getModuleByCourse);

module.exports = router;
