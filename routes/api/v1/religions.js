const express = require("express");
const {
  createReligion,
  getAllReligions,
  updateReligion
} = require("../../../controllers/religions");
const router = express.Router();

//religion data is static
router.post("/religion", createReligion);
router.get("/religion", getAllReligions);
router.put("/religion/:religion_id", updateReligion);

module.exports = router;