const { uploadImage } = require("../../../controllers/upload");
const upload = require("../../../middlewares/upload");
const express = require("express");
const router = express.Router();

router.post("/upload", upload.single("profileImage"), uploadImage);

module.exports = router;
