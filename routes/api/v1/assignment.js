const express = require("express");
const { updateAssignment, getAssignmentBySubModule } = require("../../../controllers/assignment");
const router = express.Router();

router.put("/assignment/:id", updateAssignment);
router.get("/sub-module/:id/assignment", getAssignmentBySubModule);

module.exports = router;
