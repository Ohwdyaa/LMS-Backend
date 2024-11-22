const express = require("express");
const {
  createRoles,
  getAllRoles,
  deleteRoles,
  changeUserRoles,
} = require("../../../controllers/role_teams");
const router = express.Router();
const {
  validateMiddleware,
  roleSchema,
  deleteRoleSchema,
  changeRoleSchema,
} = require("../../../middlewares/validate");

router.post("/roleTeam", validateMiddleware(roleSchema), createRoles); 
router.get("/roleTeam", getAllRoles);
router.delete("/roleTeam/:id", validateMiddleware(deleteRoleSchema), deleteRoles);
router.put("/roleTeam/:id", validateMiddleware(changeRoleSchema), changeUserRoles);

module.exports = router;