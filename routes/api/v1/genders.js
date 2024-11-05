const express = require("express");
const { createGenders, getAllGenders, updateGender } = require("../../../controllers/genders");
const router = express.Router();

//gender data is static
router.post("/gender", createGenders);
router.get("/gender", getAllGenders);
router.put("/gender/:gender_id", updateGender);

module.exports = router;