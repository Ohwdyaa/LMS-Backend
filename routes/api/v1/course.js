const express = require("express");
const { createCourse, updateCourse, deleteCourse, getAllCourses, getCourseById } = require("../../../controllers/course");
const router = express.Router();

router.post("/course", createCourse);
router.put("/course/:id", updateCourse);
router.delete("/course/:id", deleteCourse);
router.get("/course", getAllCourses);
router.get("/course/:id", getCourseById);

module.exports = router;