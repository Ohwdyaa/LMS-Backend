const express = require("express");
const { createSession } = require("../../../controllers/session");
const router = express.Router();

router.post("/session", createSession);

module.exports = router;