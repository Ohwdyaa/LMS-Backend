const express = require("express");
const {
  createReligion,
} = require("../../../controllers/religions");
const router = express.Router();

//religion data is static
router.post("/religion", createReligion);
// router.get("/religion", getAllReligions);

module.exports = router;