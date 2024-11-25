const express = require("express");
const {
  createMentor,
  updateMentor,
  deleteMentor,
  getAllMentors,
  getMentorBySubCategory,
  getMentorById,
} = require("../../../controllers/mentors");
const router = express.Router();
const {
  validateMiddleware,
  mentorSchema,
  updateMentorSchema,
  deleteMentorSchema,
} = require("../../../middlewares/validate");

router.post("/mentor", 
  validateMiddleware(mentorSchema),
  createMentor);
router.put("/mentor/:id", 
  validateMiddleware(updateMentorSchema),
  updateMentor);
router.put(
  "/mentor/:id/delete",
  validateMiddleware(deleteMentorSchema),
  deleteMentor
);
router.get("/mentor", getAllMentors);
router.get("/mentor/:id", getMentorById);
router.get("/mentor/:id/subCategory", getMentorBySubCategory);

module.exports = router;
