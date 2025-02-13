const express = require("express");
const { createQuestionOption } = require("../../../controllers/question_options");
const router = express.Router();

router.post("/question-option", createQuestionOption);

module.exports = router;