const express = require("express");
const {
  createReligion,
  updateReligion,
  deleteReligion,
  getReligionById,
  getAllReligions,
} = require("../controllers/religions");
const router = express.Router();

router.post("/religion", createReligion);
router.put("/religion/:id", updateReligion);
router.delete("/religion/:id", deleteReligion);
router.get("/religion/:id", getReligionById);
router.get("/religion", getAllReligions);

module.exports = router;
