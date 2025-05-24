const express = require("express");
const {
  getMenteeErrorStats,
  getAllModulesStatistic,
} = require("../../../controllers/statistics");
const router = express.Router();

router.get("/course/:id/statistics", getAllModulesStatistic);
router.get("/modules/:id/mentees/errors", getMenteeErrorStats);

module.exports = router;
