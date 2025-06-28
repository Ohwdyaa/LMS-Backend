const AssignSubmission = require("../models/assignment_submissions");
const { err } = require("../utils/custom_error");

async function submitAssignment(req, res) {
  try {
    const { id: assignmentId } = req.params;
    const { id: userId } = req.user;

    const isAssigmentExist =
      await AssignSubmission.getSubmissionByMenteeAndAssign(
        userId,
        assignmentId
      );
    if (isAssigmentExist === undefined) {
      const data = {
        ...req.body,
        assignmentId,
      };
      await AssignSubmission.createSubmission(data, userId);
      return res
        .status(201)
        .json({ message: "Assign submitted successfully." });
    }
    if (isAssigmentExist !== undefined) {
      return res.status(404).json({ message: "Assignment is already" });
    }
  } catch (error) {
    return res.status(400).json({
      message: error.message,
      error: err.errorCreate.message,
    });
  }
}
module.exports = {
  submitAssignment,
};
