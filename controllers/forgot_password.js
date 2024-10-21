const moment = require("moment");
const forgotPassword = require("../models/forgot_password");
const Users = require("../models/users");
const { sendResetPasswordEmail } = require("../utils/send_email");
const { hashPassword } = require("../utils/bcrypt");
const { generateResetToken, verifyJWT } = require("../utils/jwt");
const { validateEmail } = require("../middlewares/validate");

async function requestResetPassword(req, res) {
  const { email } = req.body;
  try {
    if (!validateEmail(email)) {
      return error;
    }
    const user = await Users.getUserByEmail(email);
    if (user === undefined) {
      throw new Error("User not found with the provided email address");
    }
    const resetToken = await generateResetToken(user);

    const expiredDate = moment().add(1, "hours").toDate();
    await forgotPassword.createResetToken(user.id, resetToken, expiredDate);

    await sendResetPasswordEmail(email, resetToken);

    return res.status(200).json({
      message: "Request successful",
      data: { email },
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message:
        error.message || "An error occurred while processing your request.",
      details: error.stack || null,
    });
  }
}

async function resetPassword(req, res) {
  const { id: userId } = req.params;
  const newPassword = req.body;
  try {
    const verify = await verifyJWT(token);
    const user = await Users.getUserById(verify.userId);
    if (user === undefined) {
      throw new Error("Invalid credentials");
    }
    const hashedPassword = await hashPassword(newPassword);
    await Users.updatePassword(user.id, hashedPassword);
    return res.status(200).json({
      message: "password updated successfully",
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new Error("Token expired");
    }
    return res.status(error.statusCode || err.errorUpdate.statusCode).json({
      message: error.message || err.errorUpdate.message,
      details: error.details || null,
    });
  }
}
module.exports = {
  requestResetPassword,
  resetPassword,
};
