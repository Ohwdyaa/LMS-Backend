const express = require("express");
const {
  updatePermissionHandler,
  getAllPermissionHandler,
  getPermissionByRoleHandler
} = require("../controllers/permissions");
const router = express.Router();

router.get("/permission", getAllPermissionHandler);
router.get("/permission/:id", getPermissionByRoleHandler);
router.put("/permission", updatePermissionHandler);
module.exports = router;