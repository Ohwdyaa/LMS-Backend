const express = require("express");
const {
  rolePermissionHandler,
  updatePermissionHandler,
} = require("../controllers/permissions");
const router = express.Router();

router.post("/permission",  rolePermissionHandler);
router.put("/permission/:id",  updatePermissionHandler);
module.exports = router;