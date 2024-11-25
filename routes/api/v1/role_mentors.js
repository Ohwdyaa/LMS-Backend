const express = require("express");
const {
  createRoleMentor,
  getAllRoleMentors,
  deleteRoleMentor,
  changeMentorRole,
} = require("../../../controllers/role_mentors");
const router = express.Router();
router.post("/roleMentor", createRoleMentor);
router.get("/roleMentor", getAllRoleMentors);
router.delete("/roleMentor/:id", deleteRoleMentor);
router.put("/roleMentor/:id", changeMentorRole);

module.exports = router;
