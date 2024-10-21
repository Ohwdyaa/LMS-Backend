const express = require("express");
const {
  updatePermission,
  getAllPermission,
  getPermissionByRole,
  createPermission
} = require("../controllers/permissions");
const router = express.Router();

router.post("/permission", createPermission);
router.get("/permission", getAllPermission);
router.get("/permission/:id", getPermissionByRole);
router.put("/permission/:id", updatePermission);
module.exports = router;