const express = require("express");
const {
  createRoleTeam,
  getAllRoleTeams,
  deleteRoleTeam,
  changeTeamRole,
} = require("../../../controllers/role_teams");
const router = express.Router();
const {
  validateMiddleware,
  roleSchema,
  deleteRoleSchema,
  changeRoleSchema,
} = require("../../../middlewares/validate");

router.post("/roleTeam", validateMiddleware(roleSchema), createRoleTeam);
router.get("/roleTeam", getAllRoleTeams);
router.delete(
  "/roleTeam/:id",
  validateMiddleware(deleteRoleSchema),
  deleteRoleTeam
);
router.put(
  "/roleTeam/:id",
  validateMiddleware(changeRoleSchema),
  changeTeamRole
);

module.exports = router;
