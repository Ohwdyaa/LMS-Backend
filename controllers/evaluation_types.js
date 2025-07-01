const { err } = require("../utils/custom_error");
const evaluationTypes = require("../models/evaluation_types");

async function createEvaluationTypes(req, res) {
  const data = req.body;
  try {
    await evaluationTypes.createEvaluationTypes(data);
    return res.status(201).json({
      message: "Type created successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || err.errorCreate.statusCode).json({
      message: error.message,
      error: err.errorCreate.message,
    });
  }
}
async function getAllEvaluationTypes(req, res) {
  try {
    const data = await evaluationTypes.getAllEvalutionTypes();
    if (data.length === 0) {
      return res.status(404).json({ message: "Types not found" });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: error.message,
      error: err.errorSelect.message,
    });
  }
}

module.exports = {
  createEvaluationTypes,
  getAllEvaluationTypes,
};
