const express = require("express");
const {
  createCourse,
  updateCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
  getCourseByMentee,
} = require("../../../controllers/courses");
const {
  validateMiddleware,
  courseSchema,
  updateCourseSchema,
} = require("../../../middlewares/validate");
const { uploadCourseThumbnail } = require("../../../middlewares/upload_thumbnail");
const router = express.Router();

router.post("/course", uploadCourseThumbnail, validateMiddleware(courseSchema), createCourse);
router.put("/course/:id", uploadCourseThumbnail, validateMiddleware(updateCourseSchema), updateCourse);
router.delete("/course/:id", deleteCourse);
router.get("/course", getAllCourses);
router.get("/course/:id", getCourseById); 
router.get("/course-mentee", getCourseByMentee);

module.exports = router;
