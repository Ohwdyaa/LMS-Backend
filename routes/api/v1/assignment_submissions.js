const express = require("express");
const {
  submitAssignment,
} = require("../../../controllers/assignment_submissions");
const router = express.Router();

router.put("/submit/:id", submitAssignment);
module.exports = router;
