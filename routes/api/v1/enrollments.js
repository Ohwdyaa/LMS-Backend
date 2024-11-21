const express = require("express");
const router = express.Router();
const { enrollMentor, unEnroll } = require("../../../controllers/enrollments");

router.put("/enroll/:id/course", enrollMentor);
router.put("/enroll/:id", unEnroll);

module.exports = router;
