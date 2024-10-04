const Users = require("../models/users");
const { generateJWT, verifyJWT } = require("../utils/jwt");
const { validateEmail } = require("../middlewares/validate");
const { verifyPassword, hashPassword } = require("../utils/bcrypt");
const Roles = require("../models/roles");

async function loginUser(email, password) {
  try {
    if (!email || !password) {
      return error;
    }
    const user = await verifyUser(email, password);
    if (!user) {
      throw error;
    }
    const token = generateJWT(user);
    const decoded = verifyJWT(token);
    // const refreshToken = generateRefreshToken(user);
    // await Users.updateRefreshToken(user.id, refreshToken);
    return {
      token,
      user: {
        username: user.username,
      },
    };
  } catch (error) {
    throw error;
  }
}

async function createUser(data) {
  try {
    if (!validateEmail(data.email)) {
      return error;
    }
    const validRole = await Roles.getRoleById(data.roleId);
    if (!validRole) {
      return error;
    }
    const password = "admin12345";
    const hash = await hashPassword(password);
    const userData = {
      ...data,
      password: hash,
    };
    const userId = await Users.createUser(userData);
    return userId;
  } catch (error) {
    throw error;
  }
}

async function updateUser(userId, userData) {
  try {
    const user = await Users.getUserById(userId);
    if (user.affectedRows === 0) {
      throw error;
    }
    await Users.updateUser(userId, userData);
  } catch (error) {
    throw error;
  }
}

async function deleteUser(userId) {
  try {
    const user = await Users.getUserById(userId);
    if (user.affectedRows === 0) {
      throw error;
    }
    await Users.deleteUser(userId);
  } catch (error) {
    throw error;
  }
}

async function getAllUser() {
  try {
    const users = await Users.getAllUser();
    if (!users || users.length === 0) {
      throw error;
    }
    const userList = [];
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      userList.push({
        id: user.id,
        email: user.email,
        fullname: user.fullname,
        gender: user.gender,
        role: user.role,
      });
    }
    return userList;
  } catch (error) {
    throw error;
  }
}

async function verifyUser(email, password) {
  try {
    const user = await Users.getUserByEmail(email);
    if (!user) {
      return null;
    }
    const isValid = await verifyPassword(password, user.password);
    return isValid ? user : null;
  } catch (error) {
    throw error;
  }
}

async function forgetPassword(newPassword, userId) {
  try {
    const hashedPassword = await hashPassword(newPassword);
    await Users.forgetUserPassword(hashedPassword, userId);
  } catch (error) {
    throw error;
  }
}

async function changeUserRole(userId, newRoleId) {
  try {
    const user = await Users.getUserById(userId);
    if (!user) {
      throw error;
    }

    await Users.changeUserRole(userId, newRoleId);
  } catch (error) {
    throw error;
  }
}
async function logoutUser(token) {
  try {
    const result = await Users.logoutUser(token);
    return result;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  loginUser,
  createUser,
  updateUser,
  deleteUser,
  getAllUser,
  verifyUser,
  forgetPassword,
  changeUserRole,
  logoutUser,
  // getAccessToken,
};

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
