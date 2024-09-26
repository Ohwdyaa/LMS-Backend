const Users = require('../../models/users');
const { generateJWT, generateRefreshToken } = require('../../utils/jwt');
const { CustomError, errorMessages } = require('../../utils/customError');
const { validateEmail } = require('../../middlewares/validate');
const { verifyPassword, hashPassword } = require('../../utils/crypto');

async function createUser(data) {
    try {
        const { email, password } = data;
        if (!email || !validateEmail(email)) {
            throw new Error(
                errorMessages.invalidEmail.message, 
                errorMessages.invalidEmail.statusCode
            );
        }
        const existingUser = await Users.getUserByEmail(email);
        if (existingUser) {
            throw new Error(
                errorMessages.emailAlready.message,
                errorMessages.emailAlready.statusCode
            );
        }

        const hash = await hashPassword(password); 
        const userData = {
            ...data,
            password: hash, 
        };
        const userId = await Users.createUser(userData);

        return userId;
    } catch (error) {
        throw new Error(
            errorMessages.failedCreate.message, 
            errorMessages.failedCreate.statusCode
        );
    }
}

async function loginUser(email, password) {
    try {
        const user = await Users.getUserByEmail(email);
        if (!user) {
            throw new Error(
                errorMessages.userNotFound.message, 
                errorMessages.userNotFound.statusCode
            );
        }
        if (!user.password) {
            throw new Error(
                errorMessages.updatePass.message,
                errorMessages.updatePass.statusCode
            );
        }


        const isValid = await verifyPassword(password, user.password);
        if (!isValid) {
            throw new Error(
                errorMessages.incorrectPass.message,
                errorMessages.incorrectPass.statusCode
            );
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
        throw error;
    }
}

async function verifyUser(email, password) {
    if (!validateEmail(email)) {
        throw new CustomError(
            errorMessages.invalidEmail.message, 
            errorMessages.invalidEmail.statusCode
        );
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
