const Users = require('../../models/users');
const { generateJWT, generateRefreshToken } = require('../../utils/jwt');
const { CustomError, errorMessages } = require('../../utils/customError');
const { validateEmail } = require('../../middlewares/validate');
const { verifyPassword, hashPassword } = require('../../utils/crypto');

async function createUser(data) {
    try {
        const { email, password } = data;

        if (!email || !validateEmail(email)) {
            throw new Error('Email is required and must be valid.');
        }
        const existingUser = await Users.getUserByEmail(email);
        if (existingUser) {
            throw new Error('Email is already registered. Please use another email.');
        }

        const hash = await hashPassword(password); 
        console.log('Hashed Password:', hash);

        const userData = {
            ...data,
            password: hash, 
        };

        console.log('User Data to Create:', userData);
        const userId = await Users.createUser(userData);
        console.log('User created with ID:', userId);

        return userId;
    } catch (error) {
        console.error('Error in UsersService.createUser:', error.message);
        throw new Error(error.message || 'Failed to create user');
    }
}

async function loginUser(email, password) {
    try {
        const user = await Users.getUserByEmail(email);
        if (!user) {
            throw new Error('Pengguna tidak ditemukan');
        }
        if (!user.password) {
            throw new Error('Password perlu diperbarui. Silakan hubungi administrator.');
        }


        const isValid = await verifyPassword(password, user.password);
        if (!isValid) {
            throw new Error('Password salah');
        }
        const token = generateJWT(user);
        const refreshToken = generateRefreshToken(user);
        await Users.updateRefreshToken(user.id, refreshToken);

        return {
            token,
            refreshToken, 
            user: { 
                id: user.id, 
                username: user.username, 
                email: user.email,
                roleId: user.roleId,
            }};
    } catch (error) {
        console.error('Login service error:', error.message);
        throw error;
    }
}

async function verifyUser(email, password) {
    if (!validateEmail(email)) {
        throw new CustomError(errorMessages.invalidEmail.message, errorMessages.invalidEmail.statusCode);
    }
    try {
        const user = await Users.getUserByEmail(email);
        if (!user) {
            return null;
        }
        const isValid = await verifyPassword(password, user.hashed_password, user.salt);
        return isValid ? user : null;
    } catch (error) {
        console.error('Error verifying user:', error);
        throw new Error('Authentication error', 500);
    }
}

module.exports = {
    createUser,
    loginUser,
    verifyUser,
};
