const Users = require("../models/users");
const { generateJWT, verifyJWT } = require("../utils/jwt");
const { validateEmail } = require("../middlewares/validate");
const { verifyPassword, hashPassword } = require("../utils/bcrypt");
const Roles = require("../models/roles");
const Permissions = require("../validate/permissions");
const { validatePermission } = require("../middlewares/auth");
const {createPermission} = require('../validate/permissions')

async function loginUser(email, password) {
  try {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }
    const user = await verifyUser(email, password);

    if (user === undefined) {
      throw new Error("Incorrect username or password!");
    }

    const permissions = await Permissions.getPermissions(user)
    if (permissions === undefined) {
      throw new Error("No permissions found for user");
    }
    const token = await generateJWT(user, permissions);
    const verifyToken = await verifyJWT(token);
    const validateAccess = await validatePermission(verifyToken);
    if (validateAccess === "Access granted") {
      return {
        token,
        user: {
          username: user.username
        },
      };
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
}

async function createUser(data) {
  try {
    if (!validateEmail(data.email)) {
      throw new Error("Invalid email format");
    }
    const validRole = await Roles.getRoleById(data.roleId);
    if (validRole === undefined) {
      throw new Error("The given role was not found");
    }
    const password = "abc123";
    const hash = await hashPassword(password);
    const userData = {
      ...data,
      password: hash,
    };
    const userId = await Users.createUser(userData);
    await createPermission(userData.roleId);
    console.log("role", userData.roleId)
    return userId;
  } catch (error) {
    throw error;
  }
}

async function updateUser(userEmail, userData) {
  try {
    const user = await Users.getUserByEmail(userEmail);
    if (user === undefined) {
      throw new Error("User not found");
    }
    await Users.updateUser(userEmail, userData);
  } catch (error) {
    throw error;
  }
}

async function deleteUser(userId) {
  try {
    const user = await Users.getUserById(userId);
    if (user === undefined) {
      throw new Error("User not found");
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
      throw new Error("No users found");
    }
    const userList = [];
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const userObj = new Object();
      userObj.id = user.id;
      userObj.username = user.username
      userObj.email = user.email;
      userObj.fullname = user.fullname;
      userObj.role = user.role;
      userObj.gender = user.gender;
      userList.push(userObj)
    }
    return userList;
  } catch (error) {
    throw error;
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
      throw new Error("No users found");
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