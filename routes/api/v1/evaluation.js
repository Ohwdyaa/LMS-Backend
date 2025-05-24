const express = require("express");
const {
  evaluateQuiz,
  getScoreById,
  getScoreByQuizAndUser,
} = require("../../../controllers/evaluation");
const router = express.Router();

router.post("/evaluation", evaluateQuiz);
router.get("/evaluation/:id", getScoreById);
router.get("/score/:quizId/:menteeId", getScoreByQuizAndUser);

module.exports = router;
