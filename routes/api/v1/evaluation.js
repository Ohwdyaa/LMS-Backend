const express = require("express");
const {
  getScoreById,
  getScoreByQuizAndUser,
  evaluation,
} = require("../../../controllers/evaluation");
const router = express.Router();

router.post("/evaluation", evaluation);
router.get("/evaluation/:id", getScoreById);
router.get("/score/:quizId/:menteeId", getScoreByQuizAndUser);

module.exports = router;
