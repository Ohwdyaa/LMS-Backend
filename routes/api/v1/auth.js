const express = require("express");
const { login, logout } = require("../../../controllers/auth");
const router = express.Router();
const {
  validateMiddleware,
  loginSchema,
} = require("../../../middlewares/validate");

router.post("/login", validateMiddleware(loginSchema), login);
router.delete("/logout", logout);

module.exports = router;