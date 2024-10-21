const { body } = require('express-validator');
const con = require('../config/db/db'); // Pastikan file db mengatur koneksi dengan benar

// Fungsi tambahan untuk validasi email menggunakan regex
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

// Validasi untuk pendaftaran pengguna
const validateUser = [
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail()
        .custom(async (email) => {
            const getEmails = "SELECT * FROM users WHERE email = ?";
            return new Promise((resolve, reject) => {
                con.query(getEmails, [email], (error, rows) => {
                    if (error) {
                        return reject(new Error("Database error occurred"));
                    } else if (rows.length > 0) {
                        return reject(new Error("User with this email already exists"));
                    } else {
                        return resolve(true);
                    }
                });
            });
        }),

    body('phone')
        .notEmpty().withMessage('Phone number is required')
        .isLength({ min: 6 }).withMessage('Phone number must be at least 6 characters long'),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

    body('passwordConfirmation')
        .notEmpty().withMessage('Password confirmation is required')
        .isLength({ min: 6 }).withMessage('Password confirmation must be at least 6 characters long')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password confirmation does not match password');
            }
            return true;
        })
];

// Validasi untuk login pengguna
const validateLogin = [
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

// Validasi untuk memperbarui data pengguna
const validateUpdateUser = [
    body('fullname')
        .optional()
        .isLength({ min: 4 }).withMessage('name must be at least 4 characters long')
        .trim()
        .escape(),
    body('Address')
        .optional()
        .isLength({ min: 5}).withMessage('Addres cannot be Empty')
        .trim()
        .escape(),

    body('email')
        .optional()
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail()
        .custom(async (email, { req }) => {
            const userId = req.params.id; 
            const getEmails = "SELECT * FROM users WHERE email = ? AND id != ?";
            return new Promise((resolve, reject) => {
                con.query(getEmails, [email, userId], (error, rows) => {
                    if (error) {
                        return reject(new Error("Database error occurred"));
                    } else if (rows.length > 0) {
                        return reject(new Error("Email is already used by another user"));
                    } else {
                        return resolve(true);
                    }
                });
            });
        }),

    body('phone_number')
        .optional()
        .isLength({ min: 10 }).withMessage('Phone number must be at least 10 characters long')
];

module.exports = {
    validateEmail,
    validateUser,
    validateLogin,
    validateUpdateUser
};
