const { createUser, loginUser } = require('./service');
const { errorMessages } = require('../../utils/customError');
const Roles = require('../../models/roles');
const Genders = require('../../models/genders');
const Religions = require('../../models/religions');
const {validateEmail} = require('../../middlewares/validate')

async function createUserHandler(req, res) {
    try {
        const userData = req.body;
        const requiredFields = ['username', 'email', 'password', 'profile_image', 'fullName', 'phone_Number', 'address', 'institute', 'date_of_birth', 'roleId', 'genderId', 'religionId'];
        for (const field of requiredFields) {
            if (!userData[field]) {
                return res.status(400).json({
                    status: 'error',
                    message: `Field ${field} is required.`,
                });
            }
        }

        if (!validateEmail(userData.email)) {
            return res.status(errorMessages.invalidEmail.statusCode).json({
                status: 'error',
                message: errorMessages.invalidEmail.message,
            });
        }

        const validRole = await Roles.getRoleById(userData.roleId);
        if (!validRole) {
            return res.status(errorMessages.roleNotFound.statusCode).json({
                status: 'error',
                message: errorMessages.roleNotFound.message,
            });
        }

        const validGender = await Genders.getGenderById(userData.genderId);
        if (!validGender) {
            return res.status(errorMessages.genderNotFound.statusCode).json({
                status: 'error',
                message: errorMessages.genderNotFound.message,
            });
        }

        const validReligion = await Religions.getReligionById(userData.religionId);
        if (!validReligion) {
            return res.status(errorMessages.religionNotFound.statusCode).json({
                status: 'error',
                message: errorMessages.religionNotFound.message,
            });
        }

        const userId = await createUser(userData);
        return res.status(201).json({
            status: 'success',
            message: 'User created successfully',
            data: { userId },
        });

    } catch (error) {
        console.error('Error in createUserHandler:', error.message);
        return res.status(errorMessages.internalServerError.statusCode).json({
            status: 'error',
            message: errorMessages.internalServerError.message, 
        });
    }
}

async function loginHandler(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(errorMessages.requiredEmailPassword.statusCode).json({
            status: 'error',
            message: errorMessages.requiredEmailPassword.message,
        });
    }

    try {
        console.log('Attempting to login user:', email);

        const { token, refreshToken, user } = await loginUser(email, password);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 24 * 60 * 60 * 1000, 
        });

        return res.status(200).json({
            status: 'success',
            message: 'Login successful',
            data: { token, user },
        });

    } catch (error) {
        console.error('Login Error:', error.message);
        return res.status(errorMessages.internalServerError.statusCode).json({
            status: 'error',
            message: errorMessages.internalServerError.message,
            details: error.message, 
        });
    }
}

module.exports = {
    createUserHandler,
    loginHandler,
};