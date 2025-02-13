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
const { uploadMentorDocs } = require("../../../middlewares/upload_mentor_docs");

router.post(
  "/mentor",
  uploadMentorDocs,
  validateMiddleware(mentorSchema),
  createMentor
);
router.put(
  "/mentor/:id",
  uploadMentorDocs,
  validateMiddleware(updateMentorSchema),
  updateMentor
);
router.put(
  "/mentor/:id/delete",
  validateMiddleware(deleteMentorSchema),
  deleteMentor
);
router.get("/mentor", getAllMentors);
router.get("/mentor/:id", getMentorById);
router.get("/sub-category/:id/mentor", getMentorBySubCategory);

module.exports = router;
