const express = require("express");
const { createCourse, updateCourse, deleteCourse, getAllCourses } = require("../../../controllers/course");
const router = express.Router();

router.post("/course", createCourse);
router.put("/course/:id", updateCourse);
router.delete("/course/:id", deleteCourse);
router.get("/course", getAllCourses);


module.exports = router;
