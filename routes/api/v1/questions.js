const express = require("express");
const { createQuestion, getQuestionByQuiz } = require("../../../controllers/questions");
const router = express.Router();

router.post("/question", createQuestion);
router.get("/quizzes/:id/questions", getQuestionByQuiz);

module.exports = router;