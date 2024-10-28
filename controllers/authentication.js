const { generateJWT, verifyJWT } = require("../utils/jwt");
const Permissions = require("./permissions");
const { validatePermission } = require("../middlewares/auth");
const {err} = require ("../utils/customError")
async function loginUsers(req, res) {
  const { email, password } = req.body;
  try {
    const user = await verifyUser(email, password);
    if (user === undefined) {
      throw new Error("Incorrect username or password!");
    }
    const permissions = await Permissions.getPermissions(user);
    if (permissions === undefined) {
      throw new Error("No permissions found for user");
    }
    const token = await generateJWT(user, permissions);
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
          username: user.username,
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
    const user = await Users.getUserByEmail(email);
    if (user === undefined) {
      return undefined;
    }
    const isValid = await verifyPassword(password, user.password);
    return isValid ? user : undefined;
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

async function logoutUsers(req, res) {
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
    loginUsers,
    verifyUser,
    forgetPassword,
    logoutUsers,
    // getAccessToken,
  };