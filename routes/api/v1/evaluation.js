const express = require("express");
const {
  getScoreById,
  getScoreByQuizAndUser,
  createEvaluation,
  getScoreQuizByModule,
} = require("../../../controllers/evaluation");
const router = express.Router();

router.post("/evaluation", createEvaluation);
router.get("/evaluation/:id", getScoreById);
router.get("/score/:quizId/:menteeId", getScoreByQuizAndUser);
router.get("/score-quiz/:id/module", getScoreQuizByModule);

module.exports = router;
