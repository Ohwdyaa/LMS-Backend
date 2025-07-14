const express = require("express");
const {
  getOverviewMetrics,
  getStatisticCourse,
  getModulesStatisticByCourse,
  getAtRiskStudents,
} = require("../../../controllers/statistics");
const router = express.Router();

router.get("/overview/:id", getOverviewMetrics);
router.get("/statistic/:id", getStatisticCourse);
router.get("/course/:id/statistics", getModulesStatisticByCourse);
router.get("/at-risk-students/:id", getAtRiskStudents);
 
module.exports = router;
