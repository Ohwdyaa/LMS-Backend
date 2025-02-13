const express = require("express");
const { updateQuiz, getQuizBySubModule } = require("../../../controllers/quiz");
const router = express.Router();

router.put("/quiz/:id", updateQuiz);
router.get("/sub-module/:id/quiz", getQuizBySubModule);

module.exports = router;
