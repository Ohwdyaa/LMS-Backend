const ProjectSubmission = require("../models/project_submissions");
const { err } = require("../utils/custom_error");

async function submitProject(req, res) {
  try {
    const { id: projectId } = req.params;
    const { id: userId } = req.user;
    const { file } = req; // file PDF dari uploadFiles.single("file")

    if (!file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    // buat fileUrl
    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/files/${
      file.filename
    }`;

    await ProjectSubmission.submit(userId, projectId, fileUrl);

    return res.status(201).json({ message: "Project submitted successfully." });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
      error: err.errorCreate.message,
    });
  }
}
module.exports = {
  submitProject,
};
