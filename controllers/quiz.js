const Quiz = require("../models/quiz");  
const { err } = require("../utils/custom_error");

async function createQuiz(req, res) {
  try {
    const { id: userId } = req.user;
    const data = req.body;

    await Quiz.createQUiz(data, userId);
    return res.status(201).json({
      message: "Quiz created successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || err.errorCreate.statusCode).json({
      message: error.message,
      error: err.errorCreate.message,
    });
  }
}
module.exports = {
  createQuiz,
};
