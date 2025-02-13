const questionOptions = require("../models/question_options");
const question = require("../models/questions");
const { err } = require("../utils/custom_error");

async function createQuestionOption(req, res) {
  try {
    const { id: userId } = req.user;
    const { questionsId } = req.body;

    const isQuestionExist = await question.getQuestionById(questionsId);
    if (!isQuestionExist || isQuestionExist.length === 0) {
      return res.status(400).json({
        message: "Invalid question selected",
      });
    }

    await questionOptions.createQuestionOption(req.body, userId, isQuestionExist.id);
    return res.status(201).json({
      message: "Question Option created successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || err.errorCreate.statusCode).json({
      message: error.message,
      error: err.errorCreate.message,
    });
  }
}
module.exports = {
  createQuestionOption,
};
