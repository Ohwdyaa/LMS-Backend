const Question = require("../models/questions");
const Quizzes = require("../models/quizzes");
const Levels = require("../models/levels");
const { err } = require("../utils/custom_error");
// const { sattoloShuffle } = require("../utils/shuffleUtils");

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

    const questionId = await Question.createQuestion(
      question,
      isQuizExist.id,
      isLevelExist.id,
      userId
    );
    return res.status(201).json({
      message: "Question created successfully",
      data: {
        id: questionId,
      },
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
    for (let i = 0; i < levelExist.length; i++) {
      const level = levelExist[i];
      levelWeights[level.name.toLowerCase()] = level.weight;
    }

    const questions = await Question.getQuestionByQuiz(quizId);
    if (questions.length === 0) {
      return res.status(404).json({ message: "No questions found for this quiz" });
    }
    const levelQuestions = {
      easy: [],
      medium: [],
      hard: [],
    };
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      const levelName = question.levelName.toLowerCase();
      if (levelQuestions[levelName]) {
        levelQuestions[levelName].push(question);
      }
    }

    const numEasy = Math.floor((levelWeights.easy / 100) * totalQuestions);
    const numMedium = Math.ceil((levelWeights.medium / 100) * totalQuestions);
    const numHard = Math.ceil((levelWeights.hard / 100) * totalQuestions);

    const selectedEasy = sattoloShuffle(levelQuestions.easy).slice(
      0,
      Math.max(1, numEasy)
    );
    const selectedMedium = sattoloShuffle(levelQuestions.medium).slice(
      0,
      Math.max(1, numMedium)
    );
    const selectedHard = sattoloShuffle(levelQuestions.hard).slice(
      0,
      Math.max(1, numHard)
    );

    const remainingQuestions =
      totalQuestions -
      (selectedEasy.length + selectedMedium.length + selectedHard.length);
    if (remainingQuestions > 0) {
      if (selectedEasy.length < numEasy) {
        selectedEasy.push(
          ...sattoloShuffle(levelQuestions.easy).slice(0, remainingQuestions)
        );
      } else if (selectedMedium.length < numMedium) {
        selectedMedium.push(
          ...sattoloShuffle(levelQuestions.medium).slice(0, remainingQuestions)
        );
      } else if (selectedHard.length < numHard) {
        selectedHard.push(
          ...sattoloShuffle(levelQuestions.hard).slice(0, remainingQuestions)
        );
      }
    }

    const selectedQuestions = [
      ...selectedEasy,
      ...selectedMedium,
      ...selectedHard,
    ];
    return res.status(200).json({
      message: "Questions retrieved successfully",
      data: selectedQuestions,
    });
  } catch (error) {
    return res.status(error.statusCode || err.errorSelect.statusCode).json({
      message: error.message,
      error: err.errorSelect.message,
    });
  }
}
function sattoloShuffle(array) {
  if (array.length === 0) {
    throw new Error("Array must be non-empty");
  }

  const n = array.length;
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

module.exports = {
  createQuestion,
  getQuestionByQuiz,
};
