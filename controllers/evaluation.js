const Evaluation = require("../models/evaluation");
const Answers = require("../models/answers");
const questionOptions = require("../models/question_options");
const Quizzes = require("../models/quizzes");
const { err } = require("../utils/custom_error");
const Mentees = require("../models/mentees");
const typesEvaluation = require("../models/evaluation_types");

async function createEvaluation(req, res) {
  const { id: userId } = req.user;
  const data = req.body;

  try {
    let score = 0;
    let result;

    if (data.quizzesId) {
      score = await scoreQuizzes(data.quizzesId, userId);
      result = await handleEvaluation(data.quizzesId, userId, score, data.typeId);
    }

    // if (assign_submison_id) {
    //   score = await scoreAssignment(assign_submit_id, userId);
    //   evaluateResult = await handleEvaluation(assign_submit_id, userId, score, 'assignment');
    // }

    // if (project_submit_id) {
    //   score = await scoreProject(project_submit_id, userId);
    //   evaluateResult = await handleEvaluation(project_submit_id, userId, score, 'project');
    // }

    return res.status(200).json({
      message: "Evaluation completed",
      result: result,
    });
  } catch (error) {
    console.error(error);
    return res.status(error.statusCode || 500).json({
      message: error.message,
    });
  }
}
async function handleEvaluation(quizzesId, userId, score, typeId) {
  let existingEvaluation;
  const types = await typesEvaluation.getEvalutionTypesById(typeId);
  if(types === undefined){
      return res.status(404).json({ message: "Types not found" });
  }

  if (types.name === "Quizzes") {
    existingEvaluation = await Evaluation.getByQuizAndUser(quizzesId, userId);
  }
  if (types.name === "assignment") {
    existingEvaluation = await Evaluation.getByAssignmentAndUser(id, userId);
  }
  if (types.name === "project") {
    existingEvaluation = await Evaluation.getByProjectAndUser(id, userId);
  }

  if (existingEvaluation === undefined) {
    return await Evaluation.createEvaluation(
      score,
      types.id,
      userId,
      quizzesId
    );
  }
  if (existingEvaluation) {
    return await Evaluation.updateEvaluation(
      score,
      userId,
      existingEvaluation.id
    );
  }
}
async function scoreQuizzes(quizzesId, userId) {
  const answers = await Answers.getByQuizAndUser(quizzesId, userId);
  if (answers === undefined) {
    return res.status(404).json({ message: "Answers not found" });
  }
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
  return (correctAnswers / totalQuestions) * 100;
}
async function scoreAssignment(quizzesId, userId) {
  const answers = await Answers.getByQuizAndUser(quizzesId, userId);
  if (answers === undefined) {
    return res.status(404).json({ message: "Answers not found" });
  }
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
  return (correctAnswers / totalQuestions) * 100;
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
  createEvaluation,
  getScoreById,
  getScoreByQuizAndUser,
};
