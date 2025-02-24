const express = require("express");
const { createClass } = require("../../../controllers/class");
const router = express.Router();

router.post("/class", createClass);

module.exports = router;