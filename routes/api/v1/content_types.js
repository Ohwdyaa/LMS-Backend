const express = require("express");
const { createContentTypes, getAllContentTypes } = require("../../../controllers/content_types");
const router = express.Router();

router.post("/type", createContentTypes);
router.get("/type", getAllContentTypes);

module.exports = router;