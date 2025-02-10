const express = require("express");
const { createQuiz } = require("../../../controllers/quiz");
const router = express.Router();

router.post("/quizzes", createQuiz);

module.exports = router;