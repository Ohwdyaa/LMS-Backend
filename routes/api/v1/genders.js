const express = require("express");
const { createGenders, getAllGenders } = require("../../../controllers/genders");
const router = express.Router();

//gender data is static
router.post("/gender", createGenders);

router.get("/gender", getAllGenders);
module.exports = router;