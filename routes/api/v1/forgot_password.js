const express = require("express");
const {
  requestResetPassword,
  resetPassword,
} = require("../../../controllers/forgot_password");
const router = express.Router();

router.post("/request", requestResetPassword);

// change password = req.query
router.post("/reset", resetPassword);

module.exports = router;