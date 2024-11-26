const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/files/');
  },
  filename: (req, file, cb) => {
    cb(null, `user-${req.user.id}-${file.originalname}`); 
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true); 
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};

const uploadFiles = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024, 
  },
  fileFilter,
});

module.exports = uploadFiles;
