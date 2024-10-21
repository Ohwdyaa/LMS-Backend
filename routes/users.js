const express = require("express");
const {
  loginUser,  
  createUser,
  updateUser,
  deleteUser,
  getAllUser,
  changeUserRole,
  logoutUser,
} = require("../controllers/users");
const {
  validateUser, 
  validateLogin,
  validateUpdateUser
} = require("../middlewares/validate")
const router = express.Router();
const { passport } = require("../middlewares/auth");


router.post("/login", loginUser);
router.post("/user", passport.authenticate("jwt", { session: false }), createUser);
router.put("/user", passport.authenticate("jwt", { session: false }), updateUser);
router.delete("/user/:id", passport.authenticate("jwt", { session: false }), deleteUser);
router.get("/user", passport.authenticate("jwt", { session: false }), getAllUser);
router.put("/user/:id", passport.authenticate("jwt", { session: false }), changeUserRole);
router.delete("/logout", passport.authenticate("jwt", { session: false }), logoutUser);
// router.get("/token", refreshTokenHandler);

module.exports = router;