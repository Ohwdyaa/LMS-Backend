const express = require("express");
const {
  submitAssignment,
  getAllSubmissions,
  getSubmissionByModule,
} = require("../../../controllers/assignment_submissions");
const router = express.Router();

router.put("/submit/:id", submitAssignment);
router.get("/submit-assignments", getAllSubmissions);
router.get("/module/:id/submit", getSubmissionByModule);
module.exports = router;
