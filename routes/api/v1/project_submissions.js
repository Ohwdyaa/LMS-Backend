const express = require("express");
const { submitProject, getAllSubmissions } = require("../../../controllers/project_submissions");
const router = express.Router();

router.put("/submit-project/:id", submitProject);
router.get("/submit-projects", getAllSubmissions);
module.exports = router;
