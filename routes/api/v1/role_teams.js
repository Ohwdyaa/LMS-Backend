const express = require("express");
const {
  createRoleTeam,
  getAllRoleTeams,
  deleteRoleTeam,
  updateRoleTeam,
  getRoleTeamHierarchy,
} = require("../../../controllers/role_teams");
const router = express.Router();
const {
  validateMiddleware,
  roleSchema,
  updateRoleSchema,
} = require("../../../middlewares/validate");

router.post("/role-team", validateMiddleware(roleSchema), createRoleTeam);
router.put(
  "/role-team/:id",
  validateMiddleware(updateRoleSchema),
  updateRoleTeam
);
router.get("/role-team", getAllRoleTeams);
router.delete("/role-team/:id", deleteRoleTeam);
router.get("/role-team/hierarchy", getRoleTeamHierarchy);
module.exports = router;
