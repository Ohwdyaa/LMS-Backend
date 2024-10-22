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
  validateLogin,
  validateUser, 
  validateUpdateUser,
  validateDelete
} = require("../middlewares/validate")
const router = express.Router();
const { passport } = require("../middlewares/auth");


router.post("/login", validateLogin, loginUser);
router.post("/user", passport.authenticate("jwt", { session: false }), validateUser, createUser);
router.put("/user", passport.authenticate("jwt", { session: false }), validateUpdateUser, updateUser);
router.delete("/user/:id", passport.authenticate("jwt", { session: false }), validateDelete, deleteUser);
router.get("/user", passport.authenticate("jwt", { session: false }), getAllUser);
router.put("/user/:id", passport.authenticate("jwt", { session: false }), changeUserRole);
router.delete("/logout", passport.authenticate("jwt", { session: false }), logoutUser);
// router.get("/token", refreshTokenHandler);

module.exports = router;