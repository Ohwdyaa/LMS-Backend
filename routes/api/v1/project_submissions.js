const express = require("express");
const { submitProject } = require("../../../controllers/project_submissions");
const router = express.Router();

router.put("/submit-project/:id", submitProject);

module.exports = router;
