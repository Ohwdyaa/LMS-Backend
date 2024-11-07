const express = require("express");
const { createMaterial, updateMaterial, deleteMaterial, getMaterialById } = require("../../../controllers/materials");
const router = express.Router();

router.post("/material", createMaterial);
router.put("/material/:id", updateMaterial);
router.delete("/material/:id", deleteMaterial);
router.get("/material/:id", getMaterialById);

module.exports = router;