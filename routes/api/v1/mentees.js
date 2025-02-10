const express = require("express");
const { createMentee } = require("../../../controllers/mentees");
const router = express.Router;
const {} = require("../../../middlewares/validate");

router.post("/mentee", createMentee);