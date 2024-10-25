const express = require("express");
const {
  createReligion,
  updateReligions,
  deleteReligions,
  getReligionById,
  getAllReligions,
} = require("../../../controllers/religions");
const router = express.Router();

//religion data is static
router.post("/religion", createReligion);
router.get("/religion/:id", getReligionById);
router.get("/religion", getAllReligions);

router.put("/religion/:id", updateReligions);
router.delete("/religion/:id", deleteReligions);
module.exports = router;
