const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'upload_images/mentors/'); 
  },
  filename: (req, file, cb) => {
    cb(null, `user-${req.user.id}-${file.originalname}`);
},
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); 
  } else {
    cb(new Error('Only JPEG, JPG, and PNG files are allowed!'), false); 
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, 
  },
  fileFilter,
});

module.exports = upload;
