const { uploadImage, uploadFile } = require("../../../controllers/upload");
// const uploadImages = require("../../../middlewares/upload_images");
const uploadFiles = require("../../../middlewares/upload_files");
const express = require("express");
const router = express.Router();

// router.post("/image", uploadImages.single("profileImage"), uploadImage);
router.post("/file", uploadFiles.single("document"), uploadFile);

module.exports = router;
 