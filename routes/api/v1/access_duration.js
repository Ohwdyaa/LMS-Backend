const express = require("express");
const {
  startSession,
  heartbeatSession,
  endSession,
} = require("../../../controllers/access_duration");
const router = express.Router();

router.post("/session/start", startSession);
router.put("/heartbeat/:id", heartbeatSession);
router.put("/session/:id/end", endSession);

module.exports = router;
