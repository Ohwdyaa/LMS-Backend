const express = require("express");
const { createCourse, updateCourse, deleteCourse, getAllCourses, getCourseById } = require("../../../controllers/course");
const { validateMiddleware, courseSchema, updateCourseSchema, deleteCourseSchema} = require ("../../../middlewares/validate")
const router = express.Router();

router.post("/course", validateMiddleware(courseSchema), createCourse);
router.put("/course/:id", validateMiddleware(updateCourseSchema), updateCourse);
router.delete("/course/:id", validateMiddleware(deleteCourseSchema), deleteCourse);
router.get("/course", getAllCourses);
router.get("/course/:id", getCourseById);

module.exports = router;