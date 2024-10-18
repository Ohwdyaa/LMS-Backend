const express = require("express");
const {
  requestResetPassHandler,
  resetPassHandler,
} = require("../controllers/forgot_password");
const router = express.Router();

router.post("/request",  requestResetPassHandler);
router.post("/reset", resetPassHandler);

module.exports = router;