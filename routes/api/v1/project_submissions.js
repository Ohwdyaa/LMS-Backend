const express = require("express");
const { submitProject } = require("../../../controllers/project_submissions");
// const { authenticate } = require("../../../middlewares/authenticate");

const router = express.Router();

const uploadFiles = require("../../../middlewares/upload_files");

router.post(
  "/project/:id/submit",
  uploadFiles.single("file"),
  submitProject
);

// router.get("/project/:id/submission", getSubmissionStatus);

module.exports = router;
