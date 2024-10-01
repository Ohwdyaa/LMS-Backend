const express = require("express");
const { createRoleHandler } = require("../controllers/rolesHandler");
const router = express.Router();

router.post("/role", createRoleHandler);

module.exports = router;