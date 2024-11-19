const express = require("express");
const { createMentor, updateMentor, deleteMentor, getAllMentors, getMentorBySubCategory } = require("../../../controllers/mentors");
const router = express.Router();
const {
    validateMiddleware,
    mentorSchema,
    updateMentorSchema,
    deleteMentorSchema,
  } = require("../../../middlewares/validate");

router.post("/mentor", validateMiddleware(mentorSchema), createMentor);
router.put("/mentor/:id", validateMiddleware(updateMentorSchema), updateMentor);
router.delete("/mentor/:id", validateMiddleware(deleteMentorSchema), deleteMentor);
router.get("/mentor", getAllMentors);
router.get("/mentor/:id/subCategory", getMentorBySubCategory);

module.exports = router; 