const express = require("express");
const {
  loginHandler,  
  createUserHandler,
  changeUserRoleHandler,
  // refreshTokenHandler,
  updateUserHandler,
  deleteUserHandler,
  getAllUserHandler,
  logoutUserHandler,
  // logoutHandler
} = require("../controllers/userHandler");
const router = express.Router();
const passport = require("../middlewares/auth");

router.post("/login", loginHandler);
router.post("/user", createUserHandler);
router.put("/user/:id", passport.authenticate("jwt", { session: false }), updateUserHandler);
router.delete("/user/:id", passport.authenticate("jwt", { session: false }), deleteUserHandler);
router.get("/user", getAllUserHandler);
router.put("/role/:id", passport.authenticate("jwt", { session: false }), changeUserRoleHandler);
router.delete("/logout", logoutUserandler);
router.delete("/logout", logoutUserHandler);
// router.get("/token", refreshTokenHandler);




module.exports = router;
