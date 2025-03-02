const express = require("express");
const { login, logout, loginMentee } = require("../../../controllers/auth");
const router = express.Router();
const {
  validateMiddleware,
  loginSchema,
} = require("../../../middlewares/validate");

router.post("/login", validateMiddleware(loginSchema), login);
router.post("/login-mentee", validateMiddleware(loginSchema), loginMentee);
router.delete("/logout", logout);

module.exports = router;