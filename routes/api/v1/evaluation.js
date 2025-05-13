const express = require("express");
const { evaluateQuiz, getScoreById } = require("../../../controllers/evaluation");
const router = express.Router();

router.post("/evaluation", evaluateQuiz);
router.get("/evaluation/:id", getScoreById);

module.exports = router; 