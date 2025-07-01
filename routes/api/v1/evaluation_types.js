const express = require("express");
const { createEvaluationTypes, getAllEvaluationTypes } = require("../../../controllers/evaluation_types");
const router = express.Router();

router.post("/type-evaluation", createEvaluationTypes);
router.get("/type-evaluation", getAllEvaluationTypes);

module.exports = router; 