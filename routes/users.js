const express = require("express");
const {
  loginHandler,  
  createUserHandler,
  updateUserHandler,
  deleteUserHandler,
  getAllUserHandler,
  changeUserRoleHandler,
  logoutUserHandler,
} = require("../controllers/users");
const router = express.Router();
const { passport, authorizeRole} = require("../middlewares/auth");

// const requiredRoleId = 'ed7bfc08-959a-400f-9c8f-2efbe4f4640c';
// authorizeRole (requiredRoleId),

router.post("/login", loginHandler);
router.post("/user", passport.authenticate("jwt", { session: false }), createUserHandler);
router.put("/user/:id", passport.authenticate("jwt", { session: false }), updateUserHandler);
router.delete("/user/:id", passport.authenticate("jwt", { session: false }), deleteUserHandler);
router.get("/user", passport.authenticate("jwt", { session: false }), getAllUserHandler);
router.put("/role/:id", passport.authenticate("jwt", { session: false }), changeUserRoleHandler);
router.delete("/logout", passport.authenticate("jwt", { session: false }), logoutUserHandler);
// router.get("/token", refreshTokenHandler);

module.exports = router;