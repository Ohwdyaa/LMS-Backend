const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const fileType = file.mimetype.startsWith("image/")
      ? "uploads/thumbnail/"
      : null;
    if (!fileType) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, fileType);
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}-${Date.now()}-${file.originalname}`);
  },
});
const fileFilter = (req, file, cb) => {
  const imageTypes = ["image/jpeg", "image/png", "image/jpg"];

  if (file.fieldname === "thumbnail" && imageTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const errorMessages = "Only JPEG, JPG, and PNG files are allowed!";
    if (!req.fileErrors) req.fileErrors = [];
    req.fileErrors.push({
      field: file.fieldname,
      message: errorMessages,
    });
    cb(null, false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Membatasi ukuran file menjadi 5MB
  },
  fileFilter,
});

const thumbnail = upload.fields([{ name: "thumbnail", maxCount: 1 }]);

function uploadCourseThumbnail(req, res, next) {
  thumbnail(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        message: "Error during file upload",
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
module.exports = { uploadCourseThumbnail };
