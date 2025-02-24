const Answers = require("../models/answers");
const quizzes = require("../models/quizzes");
const question = require("../models/questions");
const questionOption = require("../models/question_options");
const { err } = require("../utils/custom_error");

async function createAnswers(req, res) {
  try {
    const { id: userId } = req.user;
    const { quizzesId, questionId, questionOptionId } = req.body;

    const isQuizExist = await quizzes.getQuizById(quizzesId);
    if (!isQuizExist || isQuizExist.length === 0) {
      return res.status(400).json({
        message: "Invalid quiz selected",
      });
    }
    const isQuestionExist = await question.getQuestionById(questionId);
    if (!isQuestionExist || isQuestionExist.length === 0) {
      return res.status(400).json({
        message: "Invalid question selected",
      });
    }
    const correctOption = await questionOption.getOptionById(questionOptionId);
    if (!correctOption || correctOption.length === 0) {
      return res.status(400).json({
        message: "Invalid option selected",
      });
    }
    const isCorrect = correctOption[0].is_correct;

    await Answers.createAnswers(req.body, isCorrect, userId);
    return res.status(201).json({
      message: "Answers created successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || err.errorCreate.statusCode).json({
      message: error.message,
      error: err.errorCreate.message,
    });
  }
}
module.exports = {
  createAnswers,
};
