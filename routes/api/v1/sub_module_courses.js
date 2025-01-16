const express = require("express");
const {
  createSubModule,
  updateSubModule,
  deleteSubModule,
  getSubModuleById,
  getSubModuleByModuleCourse,
} = require("../../../controllers/sub_module_courses");
const {
  validateMiddleware,
  subModuleCourseSchema,
  updateSubModuleCourseSchema,
} = require("../../../middlewares/validate");
const router = express.Router();

router.post(
  "/subModule",
  validateMiddleware(subModuleCourseSchema),
  createSubModule
);
router.put(
  "/subModule/:id",
  validateMiddleware(updateSubModuleCourseSchema),
  updateSubModule
);
router.delete("/subModule/:id", deleteSubModule);
router.get("/subModule/:id", getSubModuleById);
router.get("/module/:id/subModule", getSubModuleByModuleCourse);

module.exports = router;
