const express = require("express");
const {
  createTeam,
  updateTeam,
  deleteTeam,
  getAllTeams,
  getTeamDetail,
} = require("../../../controllers/teams");
const router = express.Router();
const {
  validateMiddleware,
  userSchema,
  updateUserSchema,
} = require("../../../middlewares/validate");

router.post("/team", validateMiddleware(userSchema), createTeam);
router.put("/team/:id", validateMiddleware(updateUserSchema), updateTeam);
router.delete("/team/:id", deleteTeam);
router.get("/team", getAllTeams);
router.get("/team/:id", getTeamDetail);

module.exports = router;
