const express = require("express");
const {
  loginHandler,
  createUserHandler,
  changeUserRoleHandler,
  refreshTokenHandler,
  updateUserHandler,
  deleteUserHandler,
  getAllUserHandler
} = require("./handler");
const router = express.Router();
const passport = require("../../middlewares/auth");

router.get("/token", refreshTokenHandler);
router.post("/user", createUserHandler);
router.put("/user/:id", updateUserHandler);
router.delete("/user/:id", deleteUserHandler);
router.get("/user", getAllUserHandler);
router.post("/login", loginHandler);
router.put(
  "/role/:id",
  passport.authenticate("jwt", { session: false }),
  changeUserRoleHandler
);

module.exports = router;
