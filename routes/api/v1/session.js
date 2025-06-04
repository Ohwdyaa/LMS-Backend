const express = require("express");
const { createSession, getAllSession } = require("../../../controllers/session");
const router = express.Router();

router.post("/session", createSession);
router.get("/session", getAllSession);

module.exports = router; 