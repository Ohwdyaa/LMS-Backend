const express = require("express");
const { createClass, getAllClass } = require("../../../controllers/class");
const router = express.Router();

router.post("/class", createClass);
router.get("/class", getAllClass);

module.exports = router;