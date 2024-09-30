const express = require("express");
const { createRoleHandler } = require("./handler");
const router = express.Router();

router.post("/role", createRoleHandler);

module.exports = router;