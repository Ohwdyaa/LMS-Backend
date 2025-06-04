const questionOptions = require("../models/question_options");
const Questions = require("../models/questions");
const { err } = require("../utils/custom_error");

async function createQuestionOption(req, res) {
  try {
    const { id: userId } = req.user;
    const { questionsId } = req.body;

    const isQuestionExist = await Questions.getQuestionById(questionsId);
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
async function getOptionByQuestion(req, res) {
  const { id: questionId } = req.params;
  try {
    const isQuestionExist = await Questions.getQuestionById(questionId);
    if (isQuestionExist.length === 0) {
      return res.status(404).json({ message: "Question not found" });
    }
    const isOptions = await questionOptions.getOptionByQuestion(questionId);
    if (isOptions.length === 0) {
      return res.status(404).json({ message: "Options not found" });
    }
    return res.status(200).json({
      data: isOptions,
    });
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: error.message,
      error: err.errorSelect.message,
    });
  }
}
module.exports = {
  createQuestionOption,
  getOptionByQuestion
};
