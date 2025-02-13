const express = require("express");
const { createAnswers } = require("../../../controllers/answers");
const router = express.Router();

router.post("/answer", createAnswers);

module.exports = router;