const ProjectSubmission = require("../models/project_submissions");
const { err } = require("../utils/custom_error");

async function submitProject(req, res) {
  try {
    const { id: projectId } = req.params;
    const { id: userId } = req.user;

    const isProjectExist =
      await ProjectSubmission.getSubmissionByMenteeAndProject(
        userId,
        projectId
      );
    if (isProjectExist === undefined) {
      const data = {
        ...req.body,
        projectId,
      };
      await ProjectSubmission.createSubmission(data, userId);
      return res
        .status(201)
        .json({ message: "Project submitted successfully." });
    }
    if (isProjectExist !== undefined) {
      return res.status(404).json({ message: "Project is already" });
    }
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
