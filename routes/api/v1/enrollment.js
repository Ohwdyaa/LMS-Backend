const express = require("express");
const router = express.Router();
const { enrollMentor, unEnroll } = require("../../../controllers/enrollment");

router.post("/enroll", enrollMentor);
router.put("/enroll/:id", unEnroll);

module.exports = router;