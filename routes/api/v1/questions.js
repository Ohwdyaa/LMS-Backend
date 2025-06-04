const express = require("express");
const {
  getQuestionByQuiz,
  createQuestion,
  getAllQuestionByQuiz,
} = require("../../../controllers/questions");
const router = express.Router();

router.post("/question", createQuestion);
router.get("/quiz/:id/question", getQuestionByQuiz);
router.get("/quiz/:id/all-question", getAllQuestionByQuiz);

module.exports = router;
