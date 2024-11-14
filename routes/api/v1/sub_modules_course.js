const express = require("express");
const {
  createSubModule,
  updateSubModule,
  deleteSubModule,
  getSubModuleById,
  getSubModuleByModuleCourse,
} = require("../../../controllers/sub_modules_course");
const {validateMiddleware, subModuleCourseSchema, updateModuleCourseSchema, deleteSubModuleCourseSchema} = require ("../../../middlewares/validate")
const router = express.Router();

router.post("/subModule", validateMiddleware(subModuleCourseSchema), createSubModule);
router.put("/subModule/:id", validateMiddleware(updateModuleCourseSchema), updateSubModule);
router.delete("/subModule/:id", validateMiddleware(deleteSubModuleCourseSchema), deleteSubModule);
router.get("/subModule/:id", getSubModuleById);
router.get("/module/:id/subModule", getSubModuleByModuleCourse);

module.exports = router;
