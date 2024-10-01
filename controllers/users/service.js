const Users = require("../../models/users");
const { generateJWT, generateRefreshToken } = require("../../utils/jwt");
const { CustomError, errors } = require("../../utils/customError");
const { validateEmail } = require("../../middlewares/validate");
const { verifyPassword, hashPassword } = require("../../utils/bcrypt");
const jwt = require("jsonwebtoken");

async function createUser(data) {
  try {
    const { password } = data;

    const hash = await hashPassword(password);
    const userData = {
      ...data,
      password: hash,
    };

    const userId = await Users.createUser(userData);
    return userId;
  } catch (error) {
    throw new CustomError(
      errors.failedCreate.message,
      errors.failedCreate.statusCode
    );
  }
}

async function loginUser(email, password) {
  try {
    const user = await verifyUser(email, password);
    if (!user) {
      throw new CustomError(
        errors.userNotFound.message,
        errors.userNotFound.statusCode
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
      },
    };
  } catch (error) {
    throw error;
  }
}

async function verifyUser(email, password) {
  if (!validateEmail(email)) {
    throw new CustomError(
      errors.invalidEmail.message,
      errors.invalidEmail.statusCode
    );
  }
  try {
    const user = await Users.getUserByEmail(email);
    if (!user) {
      return null;
    }
    const isValid = await verifyPassword(password, user.password);
    return isValid ? user : null;
  } catch (error) {
    console.error("Error verifying user:", error);
    throw new Error("Authentication error", 500);
  }
}

const changeUserRole = async (userId, newRoleId) => {
  try {
    const user = await Users.getUserById(userId);
    if (!user) {
      throw (new errors.userNotFound.message(), errors.userNotFound.statusCode);
    }

    await Users.updateUserRole(userId, newRoleId);
    return { message: "User role updated successfully" };
  } catch (error) {
    throw new CustomError("Failed to change user role", 500);
  }
};

async function getAccessToken(refreshToken) {
  try {
    const user = await Users.getUserByRefreshToken(refreshToken);

    if (user.length === 0) {
      throw new Error("Token kadaluarsa");
    }

    const access_token = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err) => {
        if (err) throw new Error("Token Kedaluwarsa");
        const { id, username, email, role } = user[0];

        const accessToken = jwt.sign(
          { id, email, role, username },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );

        return {
          message: "Refresh Token Berhasil",
          data: {
            access_token: accessToken,
          },
        };
      }
    );

    return access_token;
  } catch (error) {
    throw new Error("Error Get access token");
  }
}

module.exports = {
  createUser,
  loginUser,
  verifyUser,
  changeUserRole,
  getAccessToken,
};
