const express = require("express");
const { loginUsers, logoutUsers } = require("../../../controllers/users");
const router = express.Router();
const {
  validateMiddleware,
  loginSchema,
} = require("../../../middlewares/validate");

router.post("/login", validateMiddleware(loginSchema), loginUsers);
router.delete("/logout", logoutUsers);

module.exports = router;
