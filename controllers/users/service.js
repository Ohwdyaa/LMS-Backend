const Users = require("../../models/users");
const { generateJWT, generateRefreshToken } = require("../../utils/jwt");
const { CustomError, errors } = require("../../utils/customError");
const { validateEmail } = require("../../middlewares/validate");
const { verifyPassword, hashPassword } = require("../../utils/bcrypt");

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
async function updateUser(userId, userData) {
  try {
    const userid = await Users.getUserById(userId);
    if (userid.affectedRows === 0) {
      throw new Error("User not found or no changes made");
    }
    await Users.updateUser(userId, userData);
  } catch (error) {
    throw new CustomError(
      errorMessages.failedDelete.message,
      errorMessages.failedDelete.statusCode
    );
  }
}

async function deleteUser(userId) {
  try {
    const user = await Users.getUserById(userId);
    if (!user) {
      throw new CustomError(
        errorMessages.userNotFound.message,
        errorMessages.userNotFound.statusCode
      );
    }
    await Users.deleteUser(userId);
  } catch (error) {
    throw new CustomError(
      errorMessages.failedDelete.message,
      errorMessages.failedDelete.statusCode
    );
  }
}

 async function getAllUser () {
  try {
    const users = await Users.getAllUser();
    if (!users || users.length === 0) {
      throw new CustomError("No users found", 404);
    }
    return users.map((user) => ({
      id: user.id,
      username: user.username,
      email: user.email,
      roleId: user.roleId,
    }));
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    throw new CustomError("Failed to fetch users", 500);
  }
};

async function changeUserRole(userId, newRoleId) {
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

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  getAllUser,
  loginUser,
  verifyUser,
  changeUserRole,
};
