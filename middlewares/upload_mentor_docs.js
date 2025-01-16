const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const fileType = file.mimetype.startsWith("image/")
      ? "uploads/profile-mentors/"
      : "uploads/docs-mentors";

    cb(null, fileType);
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}-${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const imageTypes = ["image/jpeg", "image/png", "image/jpg"];
  const documentTypes = ["application/pdf"];

  if (file.fieldname === "profileImage" && imageTypes.includes(file.mimetype)) {
    cb(null, true);
  } else if (
    ["npwp", "contract", "cv"].includes(file.fieldname) &&
    documentTypes.includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    const errorMessages =
      file.fieldname === "profileImage"
        ? "Only JPEG, JPG, and PNG files are allowed!"
        : "Only PDF files are allowed!";

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
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter,
});

const mentorDocs = upload.fields([
  { name: "profileImage", maxCount: 1 },
  { name: "npwp", maxCount: 1 },
  { name: "contract", maxCount: 1 },
  { name: "cv", maxCount: 1 },
]);

function uploadMentorDocs(req, res, next) {
  mentorDocs(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        message: "Invalid Data",
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

module.exports = { uploadMentorDocs };
