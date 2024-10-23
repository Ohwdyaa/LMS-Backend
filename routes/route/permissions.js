const express = require("express");
const {
  updatePermissions,
  getAllPermissions,
  getPermissionByRole,
  createPermission,
} = require("../../controllers/permissions");
const router = express.Router();
const {
  validateMiddleware,
  permissionSchema,
} = require("../../middlewares/validate");

router.put("/permission/:id", validateMiddleware(permissionSchema), updatePermissions);
router.get("/permission", getAllPermissions);
router.get("/permission/:id", getPermissionByRole);

//bakal dihapus soalnya cuman buat create permissionnya Superadmin.
router.post("/permission", createPermission);
module.exports = router;