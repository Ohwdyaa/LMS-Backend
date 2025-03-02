const Answers = require("../models/answers");
const quizzes = require("../models/quizzes");
const question = require("../models/questions");
const questionOption = require("../models/question_options");
const { err } = require("../utils/custom_error");

async function createAnswers(req, res) {
  try {
    const { id: userId } = req.user;
    const { quizzesId, answers } = req.body;

    const isQuizExist = await quizzes.getQuizById(quizzesId);
    if (isQuizExist === undefined) {
      return res.status(400).json({
        message: "Invalid quiz selected",
      });
    }
    const isDuplicateAnswers = await Answers.getByQuizAndUser(quizzesId, userId);
    if (isDuplicateAnswers.length > 0) {
      return res.status(400).json({
        message: "Answers are already submitted by this user for the quiz",
      });
    }
    for (let i = 0; i < answers.length; i++) {
      const { questionId, questionOptionId } = answers[i];

      const questionExists = await question.getQuestionById(questionId);
      if (questionExists === undefined) {
        return res.status(400).json({
          message: "Invalid question selected",
        });
      }

      const correctOption = await questionOption.getOptionById(
        questionOptionId
      );
      if (correctOption === undefined) {
        return res.status(400).json({
          message: "Invalid option selected",
        });
      }
      const isCorrect = correctOption.is_correct;

      await Answers.createAnswers(
        isQuizExist.id,
        questionExists.id,
        correctOption.id,
        isCorrect,
        userId
      );
    }
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
