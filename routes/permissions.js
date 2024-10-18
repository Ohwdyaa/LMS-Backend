const express = require("express");
const {
  updatePermissionHandler
} = require("../controllers/permissions");
const router = express.Router();

router.put("/permission/:id", updatePermissionHandler);
module.exports = router;