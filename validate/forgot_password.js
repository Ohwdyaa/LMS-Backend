const moment = require('moment');
const forgotPassword = require('../models/forgot_password')
const Users = require('../models/users')
const {sendResetPasswordEmail} = require('../utils/send_email')
const {hashPassword} = require('../utils/bcrypt')
const {generateResetToken, verifyJWT, } = require('../utils/jwt')   
const {validateEmail} = require('../middlewares/validate')

async function requestResetPassword(email) {
    try {
        if (!validateEmail(email)) {
            throw new Error ("invalid email format");
        }
        const user = await Users.getUserByEmail(email);
        if(user === undefined){
            throw new Error("User not found with the provided email address");
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

        const tokenData = await forgotPassword.getResetToken(token);
    if (!tokenData || tokenData.length === 0) {
      throw new Error("Invalid or already used token");
    }
    try{
        const verify = await verifyJWT(token);
        const email = verify.email;
        console.log("User Email from token:", email);

        const user = await Users.getUserByEmail(email);
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
        throw new Error;
    }
}

module.exports ={
    requestResetPassword,
    resetPassword
}