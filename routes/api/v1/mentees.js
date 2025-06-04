const express = require("express");
const { createMentee, getAllMentees, updateMentee, getMenteeDetail } = require("../../../controllers/mentees");
const { uploadMenteeDocs } = require("../../../middlewares/upload_mentee_images");
const router = express.Router();

router.post("/mentee", uploadMenteeDocs, createMentee);
router.put("/mentee/:id", updateMentee);
router.get("/mentee", getAllMentees);
router.get("/mentee/:id", getMenteeDetail);

module.exports = router;
