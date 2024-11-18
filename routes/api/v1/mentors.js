const express = require("express");
const { createMentor, updateMentor, deleteMentor, getAllMentors, getMentorBySubCategory, getMentorById } = require("../../../controllers/mentors");
const router = express.Router();

router.post("/mentor", createMentor);
router.put("/mentor/:id", updateMentor);
router.delete("/mentor/:id", deleteMentor);
router.get("/mentor", getAllMentors);
router.get("/mentor/:id", getMentorById);
router.get("/mentor/:id/subCategory", getMentorBySubCategory);

module.exports = router; 