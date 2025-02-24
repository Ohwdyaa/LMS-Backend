const Question = require("../models/questions");
const Quizzes = require("../models/quizzes");
const Levels = require("../models/levels");
const { err } = require("../utils/custom_error");
const { sattoloShuffle } = require("../utils/shuffleUtils");

async function createQuestion(req, res) {
  try {
    const { id: userId } = req.user;
    const { question, quizId, levelId } = req.body;

    const isQuizExist = await Quizzes.getQuizById(quizId);
    if (!isQuizExist || isQuizExist.length === 0) {
      return res.status(400).json({
        message: "Quiz not found",
      });
    }
    const isLevelExist = await Levels.getLevelById(levelId);
    if (!isLevelExist || isLevelExist.length === 0) {
      return res.status(400).json({
        message: "Level not found",
      });
    }

    await Question.createQuestion(
      question,
      isQuizExist.id,
      isLevelExist.id,
      userId
    );
    return res.status(201).json({
      message: "Question created successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || err.errorCreate.statusCode).json({
      message: error.message,
      error: err.errorCreate.message,
    });
  }
}
async function getQuestionByQuiz(req, res) {
  try {
    const { id: quizId } = req.params;
    const totalQuestions = 5;

    const levelExist = await Levels.getAllLevels();
    const levelWeights = {};
    levelExist.forEach((level) => {
      levelWeights[level.name.toLowerCase()] = level.weight;
    });

    const questions = await Question.getQuestionByQuiz(quizId);
    const levelQuestions = {
      easy: [],
      medium: [],
      hard: [],
    };
    questions.forEach((question) => {
      const levelName = question.level_name.toLowerCase();
      if (levelQuestions[levelName]) {
        levelQuestions[levelName].push(question);
      }
    });

    const numEasy = Math.floor((levelWeights.easy / 100) * totalQuestions);
    const numMedium = Math.ceil((levelWeights.medium / 100) * totalQuestions);
    const numHard = Math.ceil((levelWeights.hard / 100) * totalQuestions);

    const selectedEasy = sattoloShuffle(levelQuestions.easy).slice(0, numEasy);
    const selectedMedium = sattoloShuffle(levelQuestions.medium).slice(
      0,
      numMedium
    );
    const selectedHard = sattoloShuffle(levelQuestions.hard).slice(0, numHard);

    const selectedQuestions = [
      ...selectedEasy,
      ...selectedMedium,
      ...selectedHard,
    ];
    const finalQuestions = sattoloShuffle(selectedQuestions);

    return res.status(200).json({
      message: "Questions retrieved successfully",
      questions: finalQuestions,
    });
  } catch (error) {
    return res.status(error.statusCode || err.errorSelect.statusCode).json({
      message: error.message,
      error: err.errorSelect.message,
    });
  }
}

module.exports = {
  createQuestion,
  getQuestionByQuiz,
};
