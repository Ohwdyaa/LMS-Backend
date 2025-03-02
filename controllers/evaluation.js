const Evaluation = require("../models/evaluation");
const Answers = require("../models/answers");
const questionOptions = require("../models/question_options");
const { err } = require("../utils/custom_error");

async function evaluateQuiz(req, res) {
  const { id: userId } = req.user;
  const { quizId } = req.body;

  try {
    const answers = await Answers.getByQuizAndUser(quizId, userId);
    const totalQuestions = answers.length;
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
    console.log(evaluateIsExist)
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
    const result = await Evaluation.updateEvaluation(
      { score, totalQuestions },
      userId,
      evaluateIsExist.id  
    );
    return res.status(200).json({
      message: "Evaluation updated",
      result,
    });
  } catch (error) {
    return res.status(error.statusCode || err.errorCreate.statusCode).json({
      message: error.message,
      error: err.errorCreate.message,
    });
  }
}

module.exports = {
  evaluateQuiz,
};
