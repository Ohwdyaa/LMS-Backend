const express = require("express");
const { createRoleHandler } = require("./handler");
const router = express.Router();

router.post("/create_role", createRoleHandler);

module.exports = router;