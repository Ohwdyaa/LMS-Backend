const express = require("express");
const { createMentee, getAllMentees } = require("../../../controllers/mentees");
const router = express.Router();

router.post("/mentee", createMentee);
router.get("/mentee", getAllMentees);

module.exports = router;
