const express = require("express");
const {
  createRoleMentor,
  getAllRoleMentors,
  deleteRoleMentor,
  updateMentorRole,
} = require("../../../controllers/role_mentors");
const {
  validateMiddleware,
  roleSchema,
  updateRoleSchema,
} = require("../../../middlewares/validate");
const router = express.Router();
router.post("/roleMentor", validateMiddleware(roleSchema), createRoleMentor);
router.get("/roleMentor", getAllRoleMentors);
router.delete("/roleMentor/:id", deleteRoleMentor);
router.put(
  "/roleMentor/:id",
  validateMiddleware(updateRoleSchema),
  updateMentorRole
);

module.exports = router;
