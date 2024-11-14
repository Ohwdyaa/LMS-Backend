const express = require("express");
const router = express.Router();
const { enrollMentor } = require("../../../controllers/enrollment");

router.post("/enroll", enrollMentor);

module.exports = router;