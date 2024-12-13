const express = require("express");
const {
  createRoleTeam,
  getAllRoleTeams,
  deleteRoleTeam,
  updateTeamRole,
} = require("../../../controllers/role_teams");
const router = express.Router();
const {
  validateMiddleware,
  roleSchema,
  updateRoleSchema,
} = require("../../../middlewares/validate");

router.post("/roleTeam", validateMiddleware(roleSchema), createRoleTeam);
router.get("/roleTeam", getAllRoleTeams);
router.delete("/roleTeam/:id", deleteRoleTeam);
router.put(
  "/roleTeam/:id",
  validateMiddleware(updateRoleSchema),
  updateTeamRole
);

module.exports = router;
