const express = require("express");
const {
  updatePermissionTeam,
  getPermissionTeamByRole,
} = require("../../../controllers/permission_teams");
const router = express.Router();
const {
  validateMiddleware,
  permissionSchema,
} = require("../../../middlewares/validate");

router.put(
  "/permissionTeam/:id",
  validateMiddleware(permissionSchema),
  updatePermissionTeam
);

router.get("/permissionTeam/:id", getPermissionTeamByRole);

module.exports = router;
