const express = require("express");
const { updateMaterial, deleteMaterial, getMaterialById } = require("../../../controllers/materials");
const { validateMiddleware, updateMaterialSchema, deleteMaterialSchema} = require("../../../middlewares/validate")
const router = express.Router();

router.put("/material/:id", validateMiddleware(updateMaterialSchema), updateMaterial);
router.delete("/material/:id", validateMiddleware(deleteMaterialSchema), deleteMaterial);
router.get("/material/:id", getMaterialById);

module.exports = router;