const express = require("express");
const {
  loginHandler,
  createUserHandler,
  changeUserRoleHandler,
  updateUserHandler,
  deleteUserHandler,
  getAllUserHandler
} = require("./handler");
const router = express.Router();

router.post("/user", createUserHandler);
router.put("/user/:id", updateUserHandler);
router.delete("/user/:id", deleteUserHandler);
router.get("/user", getAllUserHandler);
router.post("/login", loginHandler);
router.put("/role/:id", changeUserRoleHandler);


module.exports = router;