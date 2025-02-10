const express = require("express");
const {
  createRoleTeam,
  getAllRoleTeams,
  deleteRoleTeam,
  updateRoleTeam,
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

module.exports = router;
