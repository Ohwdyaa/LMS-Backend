const express = require("express");
const { createQuestionOption, getOptionByQuestion } = require("../../../controllers/question_options");
const router = express.Router();

router.post("/question-option", createQuestionOption);
router.get("/question/:id/question-option", getOptionByQuestion);

module.exports = router;