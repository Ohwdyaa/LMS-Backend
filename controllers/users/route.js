const express = require("express");
const {
  loginHandler,
  createUserHandler,
  changeUserRoleHandler,
  refreshTokenHandler,
} = require("./handler");
const router = express.Router();
const passport = require("../../middlewares/auth");

router.get("/token", refreshTokenHandler);
router.post("/user", createUserHandler);
router.post("/login", loginHandler);
router.put(
  "/role/:id",
  passport.authenticate("jwt", { session: false }),
  changeUserRoleHandler
);

module.exports = router;
