const express = require("express");
const { loginHandler, createUserHandler, changeUserRoleHandler } = require("./handler");
const router = express.Router();

router.post("/create_user", createUserHandler);
router.post("/login", loginHandler);
router.put('/change_role', changeUserRoleHandler);


module.exports = router;