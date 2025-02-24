const express = require("express");
const router = express.Router();
const { enrollMentor, unEnroll } = require("../../../controllers/enrollments");

router.put("/course/:id/enrol-mentor", enrollMentor);
router.put("/course/:id/enrol-mentee", enrollMentor);
router.put("/enroll/:id", unEnroll);

module.exports = router;
