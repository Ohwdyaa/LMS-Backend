const jwt = require('jsonwebtoken');
const Users = require('../../models/users');
const { generateJWT } = require('../../utils/jwt'); 
const { CustomError, errorMessages } = require('../../utils/customError');
const { validateEmail } = require('../../middlewares/validate');
const { verifyPassword} = require('../../utils/crypto');

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

        console.log("Creating user with data:", { ...data, password: '[DIRAHASIAKAN]' });

        const { hash, salt } = await hashPassword(password);
        const userData = {
            ...data,
            hashed_password: hash,
            salt: salt
        };
        delete userData.password;

        const userId = await Users.createUser(userData);
        console.log("User created with ID:", userId);

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

        console.log('User data:', JSON.stringify(user, null, 2));
        console.log('Input password:', password);

        if (!user.hashed_password || !user.salt) {
            throw new Error('Password perlu diperbarui. Silakan hubungi administrator.');
        }

        const isValid = await verifyPassword(password, user.hashed_password, user.salt);
        console.log('Is password valid?', isValid);

        if (!isValid) {
            throw new Error('Password salah');
        }

        const token = generateJWT(user);
        const refreshToken = generateRefreshToken(user);

        await Users.updateRefreshToken(user.id, refreshToken);

        return { token, refreshToken, user: { id: user.id, username: user.username, email: user.email } };
    } catch (error) {
        console.error('Login service error:', error.message);
        throw error;
    }
};

async function verifyUser(email, password) {
    if (!validateEmail(email)) {
        throw new CustomError(errorMessages.invalidEmail.message, errorMessages.invalidEmail.statusCode);
    }
    try {
        const user = await Users.getUserByEmail(email);
        if (!user) {
            return null;
        }
        const isValid = await comparePassword(password, user.hashedPassword, user.salt);
        return isValid ? user : null;
    } catch (error) {
        console.error('Error verifying user:', error);
        throw new Error('Authentication error', 500);
    }
}

async function forgotPassword(email) {
    // Logika mengirim email reset password
}

async function resetPassword(token, newPassword) {
    // Logika untuk mengatur ulang password menggunakan token
}

async function getUserProfile(userId) {
    try {
        const user = await Users.getUserById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    } catch (error) {
        console.error(`Error in fetching user profile for user ID ${userId}:`, error.message);
        throw error;
    }
}

async function updateUserProfile(userId, userData) {
    // Logika untuk memperbarui profil pengguna
}

async function changePassword(userId, oldPassword, newPassword) {
    // Logika untuk mengubah password
}

async function listUsers() {
    // Logika untuk mendapatkan daftar pengguna (hanya untuk admin)
}

async function assignRole(userId, role) {
    // Logika untuk memberikan atau memperbarui peran pengguna
}

// async function updateExistingAdminPassword(email, newPassword) {
//     try {
//         const admin = await Users.getUserByEmail(email);
//         if (!admin) {
//             throw new Error('Admin tidak ditemukan');
//         }

//         const { hash, salt } = await hashPassword(newPassword);
//         await Users.updateUserPassword(admin.id, hash, salt);
//         console.log('Password admin berhasil diperbarui');
//         return true;
//     } catch (error) {
//         console.error('Gagal memperbarui password admin:', error);
//         throw error;
//     }
// }

module.exports = {
    loginUser,
    createUser,
    forgotPassword,
    resetPassword,
    getUserProfile,
    updateUserProfile,
    changePassword,
    listUsers,
    assignRole,
    verifyUser,
    // updateExistingAdminPassword,
};
