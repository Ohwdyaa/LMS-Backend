const Users = require("../models/users");
const Roles = require("../models/roles");
const Genders = require("../models/genders");
const Religions = require("../models/religions");

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}
function validateDateOfBirth(date) {
  const re = /^\d{4}-\d{2}-\d{2}$/; // Format: yyyy-mm-dd
  return re.test(date);
}
function validatePhoneNumber(phoneNumber) {
  const re = /^0\d{11}$/; // Dimulai dengan 0 dan 11 angka dibelakang
  return re.test(phoneNumber);
}

function validateLogin(req, res, next) {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  if (!validateEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({
      message: "Password is required and must be at least 6 characters long",
    });
  }
  next();
}

async function validateUser(req, res, next) {
  const { username, email, fullname, roleId, genderId, religionId } = req.body;
  console.log(req.body);
  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  if (!validateEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }
  if (!fullname) {
    return res.status(400).json({ message: "Fullname is required" });
  }
  if (!roleId) {
    return res.status(400).json({ message: "Role is required" });
  }
  if (!genderId) {
    return res.status(400).json({ message: "Gender is required" });
  }
  if (!religionId) {
    return res.status(400).json({ message: "Religion is required" });
  }
  try {
    const existingEmail = await Users.getUserByEmail(email);
    if (existingEmail && existingEmail.length > 0) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const validRole = await Roles.getRoleById(roleId);
    if (validRole === undefined) {
      return res.status(400).json({ message: "The given role was not found" });
    }

    const validGender = await Genders.getGenderById(genderId);
    if (validGender === undefined) {
      return res
        .status(400)
        .json({ message: "The given gender was not found" });
    }

    const validReligions = await Religions.getReligionById(religionId);
    if (validReligions === undefined) {
      return res
        .status(400)
        .json({ message: "The given religion was not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Database error occurred" });
  }
  next();
}

function validateUpdateUser(req, res, next) {
  const {
    username,
    fullname,
    phone_number,
    address,
    institute,
    date_of_birth,
  } = req.body;
  if (username && username.length < 4) {
    return res
      .status(400)
      .json({ message: "Username must be at least 4 characters long" });
  }
  if (fullname && fullname.length < 4) {
    return res
      .status(400)
      .json({ message: "Name must be at least 4 characters long" });
  }
  if (phone_number && !validatePhoneNumber(phone_number)) {
    return res.status(400).json({
      message: "Phone number must start with 0 and consist of 12 digits",
    });
  }
  if (address && address.length < 5) {
    return res.status(400).json({ message: "Address cannot be empty" });
  }
  if (institute && institute.length < 5) {
    return res.status(400).json({ message: "Address cannot be empty" });
  }
  if (date_of_birth && !validateDateOfBirth(date_of_birth)) {
    return res
      .status(400)
      .json({ message: "Invalid date_of_birth format. Use yyyy-mm-dd." });
  }
  next();
}
async function validateDelete(req, res, next) {
  const { id: userId } = req.params;
  console.log(userId)
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }
  const user = await Users.getUserById(userId);
  if (user === undefined) {
    throw new Error("User not found");
  }
  next();
}
module.exports = {
  validateEmail,
  validateUser,
  validateLogin,
  validateUpdateUser,
  validateDelete,
};
// const validateUser = [
//     body('email')
//         .notEmpty().withMessage('Email is required')
//         .isEmail().withMessage('Invalid email format')
//         .normalizeEmail()
//         .custom(async (email) => {
//             const getEmails = "SELECT * FROM users WHERE email = ?";
//             return new Promise((resolve, reject) => {
//                 con.query(getEmails, [email], (error, rows) => {
//                     if (error) {
//                         return reject(new Error("Database error occurred"));
//                     } else if (rows.length > 0) {
//                         return reject(new Error("User with this email already exists"));
//                     } else {
//                         return resolve(true);
//                     }
//                 });
//             });
//         }),

//     body('phone')
//         .notEmpty().withMessage('Phone number is required')
//         .isLength({ min: 6 }).withMessage('Phone number must be at least 6 characters long'),

//     body('password')
//         .notEmpty().withMessage('Password is required')
//         .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

//     body('passwordConfirmation')
//         .notEmpty().withMessage('Password confirmation is required')
//         .isLength({ min: 6 }).withMessage('Password confirmation must be at least 6 characters long')
//         .custom((value, { req }) => {
//             if (value !== req.body.password) {
//                 throw new Error('Password confirmation does not match password');
//             }
//             return true;
//         })
// ];

// Validasi untuk login pengguna
// const validateLogin = [
//     body('email')
//         .notEmpty().withMessage('Email is required')
//         .isEmail().withMessage('Invalid email format')
//         .normalizeEmail(),

//     body('password')
//         .notEmpty().withMessage('Password is required')
//         .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
// ];

// Validasi untuk memperbarui data pengguna
// const validateUpdateUser = [
//     body('fullname')
//         .optional()
//         .isLength({ min: 4 }).withMessage('name must be at least 4 characters long')
//         .trim()
//         .escape(),
//     body('Address')
//         .optional()
//         .isLength({ min: 5}).withMessage('Addres cannot be Empty')
//         .trim()
//         .escape(),

//     body('email')
//         .optional()
//         .isEmail().withMessage('Invalid email format')
//         .normalizeEmail()
//         .custom(async (email, { req }) => {
//             const userId = req.params.id;
//             const getEmails = "SELECT * FROM users WHERE email = ? AND id != ?";
//             return new Promise((resolve, reject) => {
//                 con.query(getEmails, [email, userId], (error, rows) => {
//                     if (error) {
//                         return reject(new Error("Database error occurred"));
//                     } else if (rows.length > 0) {
//                         return reject(new Error("Email is already used by another user"));
//                     } else {
//                         return resolve(true);
//                     }
//                 });
//             });
//         }),

//     body('phone_number')
//         .optional()
//         .isLength({ min: 10 }).withMessage('Phone number must be at least 10 characters long')
// ];
