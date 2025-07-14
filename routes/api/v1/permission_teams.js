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
  "/permission-team/:id",
  validateMiddleware(permissionSchema),
  updatePermissionTeam
);
router.get("/permission-team/:id", getPermissionTeamByRole);

module.exports = router; 
