const express = require("express");
const {
  createUsers,
  updateUsers,
  deleteUsers,
  getAllUsers,
  changeUserRoles,
} = require("../../../controllers/users");
const router = express.Router();
const {
  validateMiddleware,
  userSchema,
  updateUserSchema,
  deleteUserSchema,
  changeRoleSchema,
} = require("../../../middlewares/validate");

router.post("/user", validateMiddleware(userSchema), createUsers);
router.put("/user", validateMiddleware(updateUserSchema), updateUsers);
router.delete("/user/:id", validateMiddleware(deleteUserSchema), deleteUsers);
router.get("/user", getAllUsers);
router.put("/user/:id", validateMiddleware(changeRoleSchema), changeUserRoles);
// router.get("/token", refreshTokenHandler);

module.exports = router;
