const express = require("express");
const {
  updatePermissions,
  getAllPermissions,
  getPermissionByRole,
  createPermission,
} = require("../../controllers/permissions");
const router = express.Router();

router.post("/permission", createPermission);
router.get("/permission", getAllPermissions);
router.get("/permission/:id", getPermissionByRole);
router.put("/permission/:id", updatePermissions);
module.exports = router;
