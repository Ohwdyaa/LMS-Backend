const {createUser, loginUser} = require('./service');
const { errorMessages } = require('../../utils/customError');
const Roles = require('../../models/roles')
const Genders = require('../../models/genders')
const Religions = require('../../models/religions')
const { comparePassword, hashPassword } = require('../../utils/crypto');
const { validateEmail } = require('../../middlewares/validate');

async function createUserHandler(req, res) {
    try {
        const userData = req.body;

        // Pastikan semua field yang diperlukan tersedia
        const requiredFields = ['username', 'email', 'password', 'profile_image', 'fullName', 'phone_Number', 'address', 'institute', 'date_of_birth', 'roleId', 'genderId', 'religionId'];
        for (const field of requiredFields) {
            if (!userData[field]) {
                return res.status(400).json({
                    status: 'error',
                    message: `Field ${field} is required.`,
                });
            }
        }

        // Validasi role, gender, dan religion
        const validRole = await Roles.getRoleById(userData.roleId);
        if (!validRole) {
            return res.status(400).json({
                status: 'error',
                message: errorMessages.roleNotFound.message,
            });
        }

        const validGender = await Genders.getGenderById(userData.genderId);
        if (!validGender) {
            return res.status(400).json({
                status: 'error',
                message: errorMessages.genderNotFound.message,
            });
        }

        const validReligion = await Religions.getReligionById(userData.religionId);
        if (!validReligion) {
            return res.status(400).json({
                status: 'error',
                message: errorMessages.religionNotFound.message,
            });
        }

        const userId = await createUser(userData);
        return res.status(201).json({
            status: 'success',
            message: 'User created successfully',
            data: { userId }
        });
    } catch (error) {
        console.error('Error in createUserHandler:', error.message);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to create user', // Pesan yang lebih aman
        });
    }
}


async function loginHandler(req, res) {
    const { email, password } = req.body;

    if (!email || !password || !validateEmail(email)) {
        return res.status(400).json({
            status: 'error',
            message: 'Email valid dan password diperlukan',
        });
    }

    try {
        console.log('Attempting to login user:', email);
        const { accessToken, refreshToken } = await loginUser(email, password);

        console.log('Login successful, setting refresh token cookie');
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 24 * 60 * 60 * 1000 // 1 hari
        });

        console.log('Sending response');
        return res.status(200).json({
            status: 'success',
            message: 'Login successful',
            data: { accessToken }
        });

    } catch (error) {
        console.error('Login Error:', error);
        if (error.message === 'Pengguna tidak ditemukan' || error.message === 'Password salah') {
            return res.status(401).json({
                status: 'error',
                message: 'Email atau password salah'
            });
        }
        return res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        });
    }
}

// async function refreshTokenHandler(req, res) {
//     const { refreshToken } = req.body;

//     if (!refreshToken) {
//         return res.status(400).json({
//             status: 'error',
//             message: errorMessages.requiredTokenRefresh.message,
//         });
//     }

//     try {
//         const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
//         const user = await Users.getUserById(decoded.id);

//         if (!user || user.refresh_token !== refreshToken) {
//             return res.status(403).json({
//                 status: 'error',
//                 message: errorMessages.invalidTokenRefresh.message,
//             });
//         }

//         const newAccessToken = generateJWT(user);

//         res.status(200).json({
//             status: 'success',
//             accessToken: newAccessToken,
//         });
//     } catch (error) {
//         res.status(403).json({
//             status: 'error',
//             message: errorMessages.invalidTokenRefresh.message,
//         });
//     }
// }


module.exports = {
    loginHandler,
    createUserHandler,
    // updateExistingPasswords,
    // refreshTokenHandler
};
