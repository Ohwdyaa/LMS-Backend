const express = require("express");
const { createContentTypes } = require("../../../controllers/content_types");
const router = express.Router();

router.post("/type", createContentTypes);

module.exports = router;