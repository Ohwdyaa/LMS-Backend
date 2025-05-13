const express = require("express");
const { getQuestionByQuiz, createQuestion } = require("../../../controllers/questions");
const router = express.Router();

router.post("/question", createQuestion);
router.get("/quiz/:id/question", getQuestionByQuiz);

module.exports = router;  