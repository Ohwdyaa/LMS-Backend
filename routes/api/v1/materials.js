const express = require("express");
const { createMaterial, updateMaterial, deleteMaterial, getMaterialById } = require("../../../controllers/materials");
const { validateMiddleware, materialsSchema, updateMaterialSchema, deleteMaterialSchema} = require("../../../middlewares/validate")
const router = express.Router();

router.post("/material", validateMiddleware(materialsSchema), createMaterial);
router.put("/material/:id", validateMiddleware(updateMaterialSchema), updateMaterial);
router.delete("/material/:id", validateMiddleware(deleteMaterialSchema), deleteMaterial);
router.get("/material/:id", getMaterialById);

module.exports = router;