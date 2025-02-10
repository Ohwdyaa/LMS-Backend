const express = require("express");
const {
  updateMaterial,
  deleteMaterial,
  getMaterialBySubModule,
} = require("../../../controllers/materials");
const {
  validateMiddleware,
  updateMaterialSchema,
  deleteMaterialSchema,
} = require("../../../middlewares/validate");
const router = express.Router();

router.put(
  "/material/:id",
  validateMiddleware(updateMaterialSchema),
  updateMaterial
);
router.delete(
  "/material/:id",
  validateMiddleware(deleteMaterialSchema),
  deleteMaterial
);
router.get("/sub-module/:id/material", getMaterialBySubModule);

module.exports = router;