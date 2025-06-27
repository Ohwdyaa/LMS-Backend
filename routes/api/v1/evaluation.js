const express = require("express");
const {
  getScoreById,
  getScoreByQuizAndUser,
  createEvaluation,
} = require("../../../controllers/evaluation");
const router = express.Router();

router.post("/evaluation", createEvaluation);
router.get("/evaluation/:id", getScoreById);
router.get("/score/:quizId/:menteeId", getScoreByQuizAndUser);

module.exports = router;
