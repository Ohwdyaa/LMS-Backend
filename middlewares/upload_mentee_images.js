const multer = require("multer");
const path = require("path");

// Setup penyimpanan file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isImage = file.mimetype.startsWith("image/");
    const uploadDir = isImage
      ? "uploads/profile-mentees/"
      : "uploads/others/";

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const filename = `${req.user.id}-${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

// Validasi tipe file
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg"];

  if (file.fieldname === "profileImage") {
    if (allowedImageTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      if (!req.fileErrors) req.fileErrors = [];
      req.fileErrors.push({
        field: file.fieldname,
        message: "Only JPEG, JPG, and PNG files are allowed for profile image!",
      });
      cb(null, false);
    }
  } else {
    // Optional: reject unknown field
    cb(null, false);
  }
};

// Setup multer instance
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Max 5 MB
  },
  fileFilter,
});

// Field upload mentee
const menteeDocs = upload.fields([
  { name: "profileImage", maxCount: 1 },
]);

// Middleware untuk handle upload mentee
function uploadMenteeDocs(req, res, next) {
  menteeDocs(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        message: "Invalid File Upload",
        details: [
          {
            field: err.field || "unknown",
            message: err.message,
          },
        ],
      });
    } else if (err) {
      return res.status(400).json({
        message: err.message,
      });
    }

    if (req.fileErrors && req.fileErrors.length > 0) {
      return res.status(400).json({
        message: "Invalid Format",
        details: req.fileErrors,
      });
    }

    next();
  });
}

module.exports = { uploadMenteeDocs };