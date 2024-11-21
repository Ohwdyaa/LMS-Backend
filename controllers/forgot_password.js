const moment = require("moment");
const forgotPassword = require("../models/forgot_password");
const Teams = require("../models/teams");
const { sendResetPasswordEmail } = require("../utils/send_email");
const { hashPassword } = require("../utils/bcrypt");
const { generateResetToken, verifyJWT } = require("../utils/jwt");
const { validateEmail } = require("../middlewares/validate");
const { err } = require("../utils/custom_error");

async function requestResetPassword(req, res) {
  const { email } = req.body;
  try {
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "invalid email" });
    }
    const isUserExists = await Teams.getTeamByEmail(email);
    if (isUserExists === undefined) {
      return res.status(400).json({ message: "User not found with the provided email address" });
    }
    const resetToken = await generateResetToken(isUserExists);
    const expiredDate = moment().add(1, "hours").toDate();
    await forgotPassword.createResetToken(
      isUserExists.id,
      resetToken,
      expiredDate
    );

    await sendResetPasswordEmail(email, resetToken);
    return res.status(200).json({
      message: "Request successful",
      data: { email },
    });
  } catch (error) {
    res.status(err.errorRequest.statusCode).json({
      message: err.errorRequest.message,
      error: error.message,
    });
  }
}

async function resetPassword(req, res) {
  const { newPassword } = req.body;
  const {id: userId} = req.user;
  console.log(newPassword)
  try {
    // const verify = await verifyJWT(token);
    const isUserExists = await Teams.getTeamById(userId);
    if (isUserExists === undefined) {
      return res.status(400).json({ message: "User not found" });
    }

    const hashedPassword = await hashPassword(newPassword);
    await Teams.updatePassword(isUserExists.id, hashedPassword);
    return res.status(200).json({
      message: "password updated successfully",
    });
  } catch (error) {
    console.log(error)
    res.status(err.errorReset.statusCode).json({
      message: err.errorReset.message,
      error: error.message,
    });
  }
}
module.exports = {
  requestResetPassword,
  resetPassword,
};
