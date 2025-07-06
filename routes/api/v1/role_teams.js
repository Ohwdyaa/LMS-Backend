const express = require("express");
const {
  createRoleTeam,
  getAllRoleTeams,
  deleteRoleTeam,
  updateRoleTeam,
  setParentRoleTeam,
  getEffectivePermissions,
} = require("../../../controllers/role_teams");
const router = express.Router();
const {
  validateMiddleware,
  roleSchema,
  updateRoleSchema,
} = require("../../../middlewares/validate");

router.post("/role-team", validateMiddleware(roleSchema), createRoleTeam);
router.get("/role-team", getAllRoleTeams);
router.delete("/role-team/:id", deleteRoleTeam);
router.put(
  "/role-team/:id",
  validateMiddleware(updateRoleSchema),
  updateRoleTeam
);
router.post("/role-team/inherit", setParentRoleTeam);
router.get("/effective-permissions/:id", getEffectivePermissions);

// router.get("/role-team/hierarchy", getRoleTeamHierarchy);
// router.get("/role-team/:id/parents", getParentRoles);
// router.get("/role-team/:id/children", getChildRolesTeam);
// router.get("/role-team/:id/analyze", analyzeRoleHierarchy);

module.exports = router;
