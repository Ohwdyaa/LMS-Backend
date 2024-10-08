const moment = require('moment');
const forgotPassword = require('../models/forgot_password')
const Users = require('../models/users')
const {sendResetPasswordEmail} = require('../utils/send_email')
const {hashPassword} = require('../utils/bcrypt')
const {generateResetToken, verifyJWT} = require('../utils/jwt')   
const {validateEmail} = require('../middlewares/validate')

async function requestResetPassword(email) {
    try {
        if (!validateEmail(email)) {
            return error;
        }
        const user = await Users.getUserByEmail(email);
        if(user === undefined){
            throw new Error("Invalid credentials");
        }
        const resetToken = await generateResetToken(user);
        console.log('token :', resetToken)
        const expiredDate = moment().add(1, 'hours').toDate();
        await forgotPassword.createResetToken(user.id, resetToken, expiredDate)
        await sendResetPasswordEmail(email, resetToken);
    } catch (error) {
        throw error;
    }
}

async function resetPassword(token, newPassword) {
    try {
        const verify = await verifyJWT(token);
        const user = await Users.getUserById(verify.userId);
        if(user === undefined){
            throw new Error("Invalid credentials");
        }
        const hashedPassword = await hashPassword(newPassword);
        await Users.updatePassword(user.id, hashedPassword);
        return { message: "Password reset successfully" };
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new Error("Token expired");
        }
        throw error;
    }
}

module.exports ={
    requestResetPassword,
    resetPassword
}