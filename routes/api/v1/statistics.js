const express = require("express");
const {
  getMenteeErrorStats,
  getAllModulesStatistic,
  getOverviewMetrics,
  getStatisticCourse,
  getModulesStatisticByCourse,
} = require("../../../controllers/statistics");
const router = express.Router();


router.get("/modules/:id/mentees/errors", getMenteeErrorStats);

// URL: GET http://localhost:PORT/api/dashboard/overview?courseId=123
router.get("/overview/:id", getOverviewMetrics);
router.get("/statistic/:id", getStatisticCourse);
router.get("/course/:id/statistics", getModulesStatisticByCourse);

module.exports = router;
