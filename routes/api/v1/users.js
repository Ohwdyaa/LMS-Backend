const express = require("express");
const {
  createUsers,
  updateUsers,
  deleteUsers,
  getAllUsers,
  getUsersByRole,
} = require("../../../controllers/users");
const router = express.Router();
const {
  validateMiddleware,
  userSchema,
  updateUserSchema,
  deleteUserSchema,
} = require("../../../middlewares/validate");

router.post("/user", validateMiddleware(userSchema), createUsers);
router.put("/user", validateMiddleware(updateUserSchema), updateUsers);
router.delete("/user/:id", validateMiddleware(deleteUserSchema), deleteUsers);
router.get("/user", getAllUsers);
router.get("/user/:id/mentor", getUsersByRole);

// router.get("/token", refreshTokenHandler);

module.exports = router; 