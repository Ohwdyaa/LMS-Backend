const express = require("express");
const {
  requestResetPassHandler,
  resetPassHandler,
} = require("../controllers/forgot_password");
const router = express.Router();

const { passport, authorizeRole} = require("../middlewares/auth");

router.post("/request",  requestResetPassHandler);
router.post("/reset-password/:token", resetPassHandler);

module.exports = router;