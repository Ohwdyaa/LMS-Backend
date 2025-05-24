const multer = require("multer");

// Setup penyimpanan file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/files/"); // hanya path folder, bukan MIME type
  },
  filename: (req, file, cb) => {
    cb(null, `user-${req.user.id}-${file.originalname}`);
  },
});

// Validasi tipe file yang diperbolehkan
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "application/zip",
    "application/x-zip-compressed",
    "application/x-rar-compressed",
    "application/octet-stream", // fallback
    "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, ZIP, RAR, or PPTX files are allowed!"), false);
  }
};

// Konfigurasi upload
const uploadFiles = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 15 MB
  },
  fileFilter,
});

module.exports = uploadFiles;
