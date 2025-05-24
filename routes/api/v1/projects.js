const express = require("express");
const { getProjectBySubModule, updateProject } = require("../../../controllers/projects");
const router = express.Router();

router.put("/project/:id", updateProject);
router.get("/sub-module/:id/project", getProjectBySubModule);

module.exports = router;
