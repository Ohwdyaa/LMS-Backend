const express = require("express");
const {
  createReligion,
  getAllReligions,
} = require("../../../controllers/religions");
const router = express.Router();

router.post("/religion", createReligion);
router.get("/religion", getAllReligions);

module.exports = router;