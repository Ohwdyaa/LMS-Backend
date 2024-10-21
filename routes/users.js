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
const {
  validateUser, 
  validateLogin,
  validateUpdateUser
} = require("../middlewares/validate")
const router = express.Router();
const { passport } = require("../middlewares/auth");


router.post("/login", loginHandler);
router.post("/user", passport.authenticate("jwt", { session: false }), createUserHandler);
router.put("/user", passport.authenticate("jwt", { session: false }), updateUserHandler);
router.delete("/user/:id", passport.authenticate("jwt", { session: false }), deleteUserHandler);
router.get("/user", passport.authenticate("jwt", { session: false }), getAllUserHandler);
router.put("/user/:id", passport.authenticate("jwt", { session: false }), changeUserRoleHandler);
router.delete("/logout", passport.authenticate("jwt", { session: false }), logoutUserHandler);
// router.get("/token", refreshTokenHandler);

module.exports = router;