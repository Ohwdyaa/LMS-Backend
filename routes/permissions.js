const express = require("express");
const {
  updatePermission,
  getAllPermission,
  getPermissionByRole
} = require("../controllers/permissions");
const router = express.Router();

router.get("/permission", getAllPermission);
router.get("/permission/:id", getPermissionByRole);
router.put("/permission", updatePermission);
module.exports = router;