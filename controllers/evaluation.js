const Evaluation = require("../models/evaluation");
const Answers = require("../models/answers");
const questionOptions = require("../models/question_options");
const Quizzes = require("../models/quizzes");
const { err } = require("../utils/custom_error");
const Mentees = require("../models/mentees");

async function evaluateQuiz(req, res) {
  const { id: userId } = req.user;
  const { quizId } = req.body;
  try {
    const answers = await Answers.getByQuizAndUser(quizId, userId);
    const totalQuestions = answers.length;
    console.log("totalQuestions", totalQuestions);
    let correctAnswers = 0;
    for (let i = 0; i < answers.length; i++) {
      const { questionId, question_option } = answers[i];

      const correctOption = await questionOptions.getOptionByQuestionAndCorrect(
        questionId,
        1
      );
      if (correctOption && question_option === correctOption.description) {
        correctAnswers++;
      }
    }
    const score = (correctAnswers / totalQuestions) * 100;
    const evaluateIsExist = await Evaluation.getByQuizAndUser(quizId, userId);
    if (evaluateIsExist === undefined) {
      const result = await Evaluation.createEvaluation(
        { score, totalQuestions, quizId },
        userId
        //      correct_answers: correctAnswers,
      );
      return res.status(200).json({
        message: "Evaluation completed",
        result,
      });
    }
    if (evaluateIsExist !== undefined) {
      const result = await Evaluation.updateEvaluation(
        { score, totalQuestions },
        userId,
        evaluateIsExist.id
      );

      return res.status(200).json({
        message: "Evaluation complated [updated]",
        result,
      });
    }
  } catch (error) {
    return res.status(error.statusCode || err.errorCreate.statusCode).json({
      message: error.message,
      error: err.errorCreate.message,
    });
  }
}

async function getScoreById(req, res) {
  const { id: evaluationId } = req.params;
  try {
    const isScoreExist = await Evaluation.getScoreById(evaluationId);
    if (isScoreExist === undefined) {
      return res.status(404).json({ message: "Score not found" });
    }
    return res.status(200).json({
      data: isScoreExist,
    });
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: error.message,
      error: err.errorSelect.message,
    });
  }
}
async function getScoreByQuizAndUser(req, res) {
  const { quizId, menteeId } = req.params;
  try {
    const isScoreExist = await Evaluation.getByQuizAndUser(quizId, menteeId);
    if (isScoreExist === undefined) {
      return res.status(404).json({ message: "Score not found" });
    }
    return res.status(200).json({
      data: isScoreExist,
    });
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: error.message,
      error: err.errorSelect.message,
    });
  }
}
module.exports = {
  evaluateQuiz,
  getScoreById,
  getScoreByQuizAndUser,
};
