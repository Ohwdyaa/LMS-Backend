// const multer = require("../middleware/multer");

async function uploadImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    return res.status(200).json({
      message: "Image uploaded successfully",
      imageUrl: imageUrl,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error uploading image",
      error: error.message,
    });
  }
}
module.exports = { uploadImage };
