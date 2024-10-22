const express = require("express");
const {
  createReligion,
  updateReligions,
  deleteReligions,
  getReligionById,
  getAllReligions,
} = require("../../controllers/religions");
const router = express.Router();

router.post("/religion", createReligion);
router.put("/religion/:id", updateReligions);
router.delete("/religion/:id", deleteReligions);
router.get("/religion/:id", getReligionById);
router.get("/religion", getAllReligions);

module.exports = router;
