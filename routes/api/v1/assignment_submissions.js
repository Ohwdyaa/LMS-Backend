const express = require("express");
const {
  submitAssignment,
  getAllSubmissions,
} = require("../../../controllers/assignment_submissions");
const router = express.Router();

router.put("/submit/:id", submitAssignment);
router.get("/submit-assignments", getAllSubmissions);
module.exports = router;
