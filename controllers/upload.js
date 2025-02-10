async function uploadImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const imageUrl = `${req.protocol}://${req.get(
      "host"
    )}/uploads/profile-mentors/${req.file.filename}`;

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
async function uploadFile(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const fileUrl = `/uploads/files/${req.file.filename}`;

    return res.status(200).json({
      message: "File uploaded successfully",
      fileUrl,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error uploading file",
      error: error.message,
    });
  }
}

module.exports = { uploadImage, uploadFile };
