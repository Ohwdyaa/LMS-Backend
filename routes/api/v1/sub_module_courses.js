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
  "/sub-module",
  validateMiddleware(subModuleCourseSchema),
  createSubModule
);
router.put(
  "/sub-module/:id",
  validateMiddleware(updateSubModuleCourseSchema),
  updateSubModule
);
router.delete("/sub-module/:id", deleteSubModule);
router.get("/sub-module/:id", getSubModuleById);
router.get("/module/:id/sub-module", getSubModuleByModuleCourse);

module.exports = router;
