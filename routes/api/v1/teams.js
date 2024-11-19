const express = require("express");
const { createTeam, updateTeam, deleteTeam, getAllTeams } = require("../../../controllers/teams");
const router = express.Router();
const {
  validateMiddleware,
  userSchema,
  updateUserSchema,
  deleteUserSchema,
} = require("../../../middlewares/validate");

router.post("/team", validateMiddleware(userSchema), createTeam);
router.put("/team", validateMiddleware(updateUserSchema), updateTeam);
router.delete("/team/:id", validateMiddleware(deleteUserSchema), deleteTeam);
router.get("/team", getAllTeams);

module.exports = router; 