const express = require("express");
const {
  loginUsers,
  createUsers,
  updateUsers,
  deleteUsers,
  getAllUsers,
  changeUserRoles,
  logoutUsers,
} = require("../../controllers/users");
const router = express.Router();
const { passport } = require("../../middlewares/auth");

router.post("/login", loginUsers);
router.post("/user", passport.authenticate("jwt", { session: false }), createUsers);
router.put("/user", passport.authenticate("jwt", { session: false }), updateUsers);
router.delete("/user/:id", passport.authenticate("jwt", { session: false }), deleteUsers);
router.get("/user", passport.authenticate("jwt", { session: false }), getAllUsers);
router.put("/user/:id", passport.authenticate("jwt", { session: false }), changeUserRoles);
router.delete("/logout", passport.authenticate("jwt", { session: false }), logoutUsers);
// router.get("/token", refreshTokenHandler);

module.exports = router;
