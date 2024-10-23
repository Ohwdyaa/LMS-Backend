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
const {
  validateMiddleware,
  loginSchema,
  userSchema,
  updateUserSchema,
  deleteUserSchema,
  changeRoleSchema,
} = require("../../middlewares/validate");

router.post("/login", validateMiddleware(loginSchema), loginUsers);
router.post(
  "/user",
  passport.authenticate("jwt", { session: false }),
  validateMiddleware(userSchema),
  createUsers
);
router.put(
  "/user",
  passport.authenticate("jwt", { session: false }),
  validateMiddleware(updateUserSchema),
  updateUsers
);
router.delete(
  "/user/:id",
  passport.authenticate("jwt", { session: false }),
  validateMiddleware(deleteUserSchema),
  deleteUsers
);
router.get(
  "/user",
  passport.authenticate("jwt", { session: false }),
  getAllUsers
);
router.put(
  "/user/:id",
  passport.authenticate("jwt", { session: false }),
  validateMiddleware(changeRoleSchema),
  changeUserRoles
);
router.delete(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  logoutUsers
);
// router.get("/token", refreshTokenHandler);

module.exports = router;
