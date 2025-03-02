const express = require("express");
const { evaluateQuiz } = require("../../../controllers/evaluation");
const router = express.Router();

router.post("/evaluation", evaluateQuiz);

module.exports = router;