const Quiz = require("../models/quizzes");
const subModule = require("../models/sub_module_courses");
const { err } = require("../utils/custom_error");

async function updateQuiz(req, res) {
  try {
    const { id: subModuleId } = req.params;
    const { id: userId } = req.user;
    const data = req.body;

    const isSubModuleExist = await subModule.getSubModulesById(subModuleId);
    if (isSubModuleExist === undefined) {
      return res.status(404).json({ message: "Sub module not found" });
    }

    const isQuizExist = await Quiz.getQuizBySubModule(subModuleId);
    if (isQuizExist) {
      await Quiz.updateQuiz(isQuizExist.id, data, userId);
      return res.status(201).json({
        message: "Quiz updated successfully", 
      });
    }
    if (isQuizExist === undefined) {
      await Quiz.createQUiz(data, userId, isSubModuleExist.id);
      return res.status(201).json({
        message: "Quiz created successfully",
      });
    }
  } catch (error) {
    return res.status(error.statusCode || err.errorCreate.statusCode).json({
      message: error.message,
      error: err.errorCreate.message,
    });
  }
}

async function getQuizBySubModule(req, res) {
  const { id: subModuleId } = req.params;
  try {
    const isQuizExist = await Quiz.getQuizBySubModule(subModuleId);
    if (isQuizExist === undefined) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    return res.status(200).json({
      data: isQuizExist,
    });
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: error.message,
      error: err.errorSelect.message,
    });
  }
}
module.exports = {
  updateQuiz,
  getQuizBySubModule,
};
