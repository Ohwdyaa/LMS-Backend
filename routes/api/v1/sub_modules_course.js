const express = require("express");
const {
  createSubModule,
  updateSubModule,
  deleteSubModule,
  getSubModuleById,
  getSubModuleByModuleCourse,
} = require("../../../controllers/sub_modules_course");
const {validateMiddleware, subModuleCourseSchema, updateSubModuleCourseSchema, deleteSubModuleCourseSchema} = require ("../../../middlewares/validate")
const router = express.Router();

router.post("/subModule", validateMiddleware(subModuleCourseSchema), createSubModule);
router.put("/subModule/:id", validateMiddleware(updateSubModuleCourseSchema), updateSubModule);
router.delete("/subModule/:id", validateMiddleware(deleteSubModuleCourseSchema), deleteSubModule);
router.get("/subModule/:id", getSubModuleById);
router.get("/module/:id/subModule", getSubModuleByModuleCourse);

module.exports = router;