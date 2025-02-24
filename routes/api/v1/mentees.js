const express = require("express");
const { createMentee } = require("../../../controllers/mentees");
const router = express.Router();

router.post("/mentee", createMentee);

module.exports = router;
