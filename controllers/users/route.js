const express = require("express");
const { loginHandler, createUserHandler, changeUserRoleHandler } = require("./handler");
const router = express.Router();

router.post("/user", createUserHandler);
router.post("/login", loginHandler);
router.put('/role', changeUserRoleHandler);


module.exports = router;