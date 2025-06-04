const express = require("express");
const {
  enrollMentor,
  unEnroll,
  enrollMentee,
  enrollMenteeByKey,
  getMentorByCourse,
  getMenteeByCourse,
} = require("../../../controllers/enrollments");
const router = express.Router();

router.put("/course/:id/enroll-mentor", enrollMentor);
router.put("/course/:id/enroll-byKey", enrollMenteeByKey);
router.put("/course/:id/enroll-mentee", enrollMentee);
router.put("/enroll/:id", unEnroll);
router.get("/course/:id/mentor", getMentorByCourse);
router.get("/course/:id/mentee", getMenteeByCourse);
module.exports = router;
