const express = require("express");
const {
  updatePermissions,
} = require("../../../controllers/permissions");
const router = express.Router();
const {
  validateMiddleware,
  permissionSchema,
} = require("../../../middlewares/validate");

router.put(
  "/permission/:id",
  validateMiddleware(permissionSchema),
  updatePermissions
);
// router.get("/permission", getAllPermissions);
// router.get("/permission/:id", getPermissionByRole);

module.exports = router;
