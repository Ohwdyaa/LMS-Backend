const Users = require("../models/users");
const Permissions = require("./permissions");
const { generateJWT, verifyJWT } = require("../utils/jwt");
const { validatePermission } = require("../middlewares/passport");
const { verifyPassword, hashPassword } = require("../utils/bcrypt");
const { err } = require("../utils/customError");


async function login(req, res) {
  const { email, password } = req.body;
  try {
    const verifiedUser = await verifyUser(email, password);
    if (verifiedUser === undefined) {
      return res.status(400).json({ message: "Incorrect username or password!" });
    }
    const userPermissions = await Permissions.getPermissions(verifiedUser);
    if (userPermissions === undefined) {
      return res.status(400).json({ message: "No permissions found for user" });
    }
    const token = await generateJWT(verifiedUser, userPermissions);
    const verifyToken = await verifyJWT(token);
    const validateAccess = await validatePermission(verifyToken);

    if (validateAccess !== "Access granted") {
      return res
        .status(403)
        .json({ message: "Access denied: No modules available for this user" });
    }
    return res.status(200).json({
      message: "Login successful",
      data: {
        token,
        user: {
          username: verifiedUser.username,
        },
      },
    });
  } catch (error) {
    return res.status(err.errorLogin.statusCode).json({
      message: err.errorLogin.message,
      error: error.message,
    });
  }
}

async function verifyUser(email, password) {
  try {
    const isUserExists = await Users.getUserByEmail(email);
    if (isUserExists === undefined) {
      return res.status(400).json({ message: "no user with registered email" });
    }
    const isValid = await verifyPassword(password, isUserExists.password);
    return isValid ? isUserExists : undefined;
  } catch (error) {
    throw error;
  }
}

async function forgetPassword(req, res) {
  const { id: userId } = req.params;
  const { newPassword } = req.body;
  try {
    const hashedPassword = await hashPassword(newPassword);
    await Users.forgetUserPassword(hashedPassword, userId);

    return res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    return res.status(err.errorUpdate.statusCode).json({
      message: err.errorUpdate.message,
      error: error.message,
    });
  }
}

async function logout(req, res) {
  const token = req.headers.authorization?.split(" ")[1];
  if (token === undefined) {
    return res.status(400).json({ message: "No token provided" });
  }
  try {
    const result = await Users.logoutUser(token);
    if (result) {
      return res.status(200).json({
        message: "Logout successfully",
      });
    }
    return res.status(400).json({ message: "Logout failed" });
  } catch (error) {
    return res.status(err.errorLogout.statusCode).json({
      message: err.errorLogout.message,
      error: error.message,
    });
  }
}
module.exports = {
  login,
  forgetPassword,
  logout,
};
