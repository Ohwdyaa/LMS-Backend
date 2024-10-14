const express = require("express");
const {
  rolePermissionHandler,
} = require("../controllers/permissions");
const router = express.Router();

router.post("/permission", rolePermissionHandler);

module.exports = router;