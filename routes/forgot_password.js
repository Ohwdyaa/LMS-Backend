const express = require("express");
const {
  requestResetPassword,
  resetPassword,
} = require("../controllers/forgot_password");
const router = express.Router();

const { passport, authorizeRole} = require("../middlewares/auth");

router.post("/request",  requestResetPassword);
router.post("/reset", resetPassword);

module.exports = router;