const moment = require("moment");
const forgotPassword = require("../models/forgot_password");
const Teams = require("../models/teams");
const Mentors = require("../models/mentors");
const permissionTeams = require("./permission_teams");
const permissionMentors = require("./permission_mentors");
const { sendResetPasswordEmail } = require("../utils/send_email");
const { hashPassword, verifyPassword } = require("../utils/bcrypt");
const jwt = require("../utils/jwt");
const { validateEmail } = require("../middlewares/validate");
const { err } = require("../utils/custom_error");

async function requestResetPassword(req, res) {
  const { email } = req.body;
  try {
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "invalid email" });
    }

    let isUserExist = await Teams.getTeamByEmail(email);
    if (isUserExist === undefined) {
      isUserExist = await Mentors.getMentorByEmail(email);
    }
    if (isUserExist === undefined) {
      return res
        .status(404)
        .json({ message: "User not found with the provided email address" });
    }

    let getAccess = await permissionTeams.getPermissionTeams(isUserExist);
    if (getAccess === undefined) {
      getAccess = await permissionMentors.getPermissionMentor(isUserExist);
    }
    if (getAccess === undefined) {
      return res
        .status(404)
        .json({ message: "No access rights found for user." });
    }

    const resetToken = await jwt.generateTokenPassword(isUserExist, getAccess);
    const expiredDate = moment().add(1, "hours").toDate();
    await forgotPassword.createResetToken(
      isUserExist.id,
      resetToken,
      expiredDate
    );

    await sendResetPasswordEmail(email, resetToken);
    return res.status(200).json({
      message: "Request successful",
      data: { email },
    });
    // cek spam gmail kalo status berhasil
  } catch (error) {
    res.status(err.errorRequest.statusCode).json({
      message: error.message,
      error: err.errorRequest.message,
    });
  }
}

async function resetPassword(req, res) {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const { id: userId } = req.user;
  const { userType } = req.query;
  try {
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    const hashedPassword = await hashPassword(newPassword);
    let isUserExist;
    if (userType === "team") {
      isUserExist = await Teams.getTeamById(userId);
      if (isUserExist === undefined) {
        return res.status(404).json({ message: "User not found" });
      }

      const isCurrentPassword = await verifyPassword(
        currentPassword,
        isUserExist.password
      );
      if (isCurrentPassword === false) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }

      await Teams.updatePassword(isUserExist.id, hashedPassword);
      return res.status(200).json({
        message: "password updated successfully",
      });
    }
    if (userType === "mentor") {
      isUserExist = await Mentors.getMentorDetails(userId);
      if (isUserExist === undefined) {
        return res.status(404).json({ message: "User not found" });
      }

      const isCurrentPassword = await verifyPassword(
        currentPassword,
        isUserExist.password
      );
      if (isCurrentPassword === false) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }

      await Mentors.updatePassword(isUserExist.id, hashedPassword);
      return res.status(200).json({
        message: "password updated successfully",
      });
    }

    if (isUserExist === undefined) {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(err.errorReset.statusCode).json({
      message: error.message,
      error: err.errorUpdate.message,
    });
  }
}

module.exports = {
  requestResetPassword,
  resetPassword,
};
