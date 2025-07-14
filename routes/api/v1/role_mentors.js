const express = require("express");
const {
  createRoleMentor,
  getAllRoleMentors,
  deleteRoleMentor,
  updateMentorRole,
  getRoleMentorHierarchy
} = require("../../../controllers/role_mentors");
const {
  validateMiddleware,
  roleSchema,
  updateRoleSchema,
} = require("../../../middlewares/validate");
const router = express.Router();
router.post("/role-mentor", validateMiddleware(roleSchema), createRoleMentor);
router.put(
  "/role-mentor/:id",
  validateMiddleware(updateRoleSchema),
  updateMentorRole
);
router.get("/role-mentor", getAllRoleMentors);
router.delete("/role-mentor/:id", deleteRoleMentor);
router.get("/role-mentor/hierarchy", getRoleMentorHierarchy);

module.exports = router;
