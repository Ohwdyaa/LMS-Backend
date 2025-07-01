const Evaluation = require("../models/evaluation");
const Answers = require("../models/answers");
const submitAssign = require("../models/assignment_submissions");
const submitProject = require("../models/project_submissions");
const questionOptions = require("../models/question_options");
const { err } = require("../utils/custom_error");
const typesEvaluation = require("../models/evaluation_types");

async function createEvaluation(req, res) {
  const { id: userId } = req.user;
  const data = req.body;

  try {
    let score = 0;
    let result;

    //Quizzes
    if (data.quizzesId) {
      score = await scoreQuizzes(data.quizzesId, userId);
      result = await handleEvaluation(score, data, userId);
    }
    //Assignment
    if (data.assignSubmitId) {
      const submissions = await submitAssign.getSubmissionById(
        data.assignSubmitId
      );
      if (submissions === undefined) {
        return res.status(404).json({ message: "assignment mentee not found" });
      }
      result = await handleEvaluation(data.score, data, userId);
    }
    //Project
    if (data.projectSubmitId) {
      const submissions = await submitProject.getSubmissionById(
        data.projectSubmitId
      );
      if (submissions === undefined) {
        return res.status(404).json({ message: "project mentee not found" });
      }
      result = await handleEvaluation(data.score, data, userId);
    }

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
async function scoreQuizzes(id, userId) {
  const answers = await Answers.getByQuizAndUser(id, userId);
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

async function handleEvaluation(score, data, userId) {
  let existingEvaluation;

  const types = await typesEvaluation.getEvalutionTypesById(data.typeId);
  if (types === undefined) {
    return res.status(404).json({ message: "Types not found" });
  }
  
  //quizzes
  if (types.name === "Quizzes") {
    existingEvaluation = await Evaluation.getScoreByQuizAndUser(
      data.quizzesId,
      userId
    );
    if (existingEvaluation === undefined) {
      return await Evaluation.createEvaluationQuiz(
        score,
        types.id,
        userId,
        data.quizzesId
      );
    }
    if (existingEvaluation !== undefined) {
      return await Evaluation.updateEvaluation(
        score,
        userId,
        existingEvaluation.id
      );
    }
  }
  //assignment
  if (types.name === "Assignment") {
    existingEvaluation = await Evaluation.getScoreByAssignAndUser(
      data.assignSubmitId,
      userId
    );
    if (existingEvaluation === undefined) {
      return await Evaluation.createEvaluationAssign(
        score,
        data,
        types.id,
        userId
      );
    }
    if (existingEvaluation !== undefined) {
      return await Evaluation.updateEvaluation(
        score,
        userId,
        existingEvaluation.id
      );
    }
  }
  //project
  if (types.name === "Project") {
    existingEvaluation = await Evaluation.getScoreByProjectAndUser(data.projectSubmitId, userId);
    if (existingEvaluation === undefined) {
      return await Evaluation.createEvaluationProject(
        score,
        data,
        types.id,
        userId
      );
    }
    if (existingEvaluation !== undefined) {
      return await Evaluation.updateEvaluation(
        score,
        userId,
        existingEvaluation.id
      );
    }
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
  createEvaluation,
  getScoreById,
  getScoreByQuizAndUser,
};
