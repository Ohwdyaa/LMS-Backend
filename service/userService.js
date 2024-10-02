const Users = require("../models/users");
const { generateJWT } = require("../utils/jwt");
const { CustomError, err } = require("../utils/customError");
const { validateEmail } = require("../middlewares/validate");
const { verifyPassword, hashPassword } = require("../utils/bcrypt");

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
      err.failedCreate.message,
      err.failedCreate.statusCode
    );
  }  
}

async function loginUser(email, password) {
  try {
    const user = await verifyUser(email, password);
    if (!user) {
      throw err.userNotFound();
    }
    const token = generateJWT(user);
    // const refreshToken = generateRefreshToken(user);
    // await Users.updateRefreshToken(user.id, refreshToken);
    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        roleId: user.role_id,
      },
    };  
  } catch (error) {
    throw new CustomError(
      err.errLogin.message,
      err.errLogin.statusCode
    );
  }
}

async function verifyUser(email, password) {
  if (!validateEmail(email)) {
    throw err.invalidEmail();
  }
  try {
    const user = await Users.getUserByEmail(email);
    if (!user) {
      return null;
    }

    const isValid = await verifyPassword(password, user.password);
    return isValid ? user : null;
  } catch (error) {
    throw new CustomError(
      err.authError.message,
      err.authError.statusCode
    );
  }
}

async function updateUser(userId, userData) {
  try {
    const userid = await Users.getUserById(userId);
    if (userid.affectedRows === 0) {
      throw Error("User not found or no changes made");
    }
    await Users.updateUser(userId, userData);
  } catch (error) {
    throw new CustomError(
      err.failedUpdate.message,
      err.failedUpdate.statusCode
    );
  }
}

async function deleteUser(userId) {
  try {
    const user = await Users.getUserById(userId);
    if (!user) {
      throw err.userNotFound;
    }
    await Users.deleteUser(userId);
  } catch (error) {
    throw { message: err.failedDelete.message, originalError: error };
  }
}

async function getAllUser() {
  try {
    const users = await Users.getAllUser();
    if (!users || users.length === 0) {
      throw new CustomError("No users found", 404);
    }
    return users.map((user) => ({
      id: user.id,
      email: user.email,
      fullname: user.fullname,
      gender: user.gender,
      role: user.role,
    }));
  } catch (error) {
    throw new CustomError(
      err.errGet.message,
      err.errGet.statusCode
    );
  }
}

async function changeUserRole(userId, newRoleId) {
  try {
    const user = await Users.getUserById(userId);
    if (!user) {
      throw err.userNotFound;
    }

    await Users.updateUserRole(userId, newRoleId);
    return { message: "User role updated successfully" };
  } catch (error) {
    throw new CustomError(
      err.changeRole.message,
      err.changeRole.statusCode
    );
  }
}
async function logoutUser(token) {
  try {
    const result = await Users.logoutUser(token);
    return result; 
  } catch (error) {
    throw new CustomError(
      err.logoutErr.message,
      err.logoutErr.statusCode
    );
  }
}

// async function getAccessToken(refreshToken) {
//   try {
//     const user = await Users.getUserByRefreshToken(refreshToken);

//     if (user.length === 0) {
//       throw new Error("Token kadaluarsa");
//     }

//     const access_token = jwt.verify(
//       refreshToken,
//       process.env.REFRESH_TOKEN_SECRET,
//       (err) => {
//         if (err) throw new Error("Token Kedaluwarsa");
//         const { id, username, email, role } = user[0];

//         const accessToken = jwt.sign(
//           { id, email, role, username },
//           process.env.JWT_SECRET,
//           {
//             expiresIn: "1h",
//           }
//         );

//         return {
//           message: "Refresh Token Berhasil",
//           data: {
//             access_token: accessToken,
//           },
//         };
//       }
//     );

//     return access_token;
//   } catch (error) {
//     throw new Error("Error Get access token");
//   }
// }

// async function logoutUser(refreshToken) {
//   try {
//     if (!refreshToken) throw new Error("No refresh token provided");
//     const isLogout = await Users.logoutUser(refreshToken);
//     if (!isLogout) throw new Error("Logout failed");
//     return;
//   } catch (error) {
//     if (error instanceof CustomError) {
//       res.status(error.statusCode).json({
//           message: error.message,
//       });
//   } else {
//       console.error("Unexpected error:", error);
//       res.status(500).json({
//           message: "Internal Server Error",
//           error: error.message,
//       });
//   }
//   }

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  getAllUser,
  loginUser,
  verifyUser,
  changeUserRole,
  // getAccessToken,
  logoutUser
};
