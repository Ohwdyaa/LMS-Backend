const Users = require("../models/users");
const { generateJWT, verifyJWT } = require("../utils/jwt");
const { verifyPassword, hashPassword } = require("../utils/bcrypt");
const Permissions = require("./permissions");
const { validatePermission } = require("../middlewares/auth");
const { err } = require("../utils/customError");

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

async function createUsers(req, res) {
  const data = req.body;
  try {
    const password = "admin12345";
    const hash = await hashPassword(password);
    const userData = {
      ...data,
      password: hash,
    };
    await Users.createUser(userData);

    return res.status(201).json({
      message: "User created successfully",
    });
  } catch (error) {
    return res.status(err.errorCreate.statusCode).json({
      message: err.errorCreate.message,
      error: error.message,
    });
  }
}

async function updateUsers(req, res) {
  const userEmail = req.user.email; //dari jwt
  const userData = req.body;
  try {
    const user = await Users.getUserByEmail(userEmail);
    if (user === undefined) {
      throw new Error("User not found");
    }

    await Users.updateUser(userEmail, userData);
    return res.status(200).json({
      message: "User updated successfully",
    });
  } catch (error) {
    return res.status(err.errorUpdate.statusCode).json({
      message: err.errorUpdate.message,
      error: error.message,
    });
  }
}

async function deleteUsers(req, res) {
  const userId = req.params.id;
  try {
    await Users.deleteUser(userId);
    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(err.errorDelete.statusCode).json({
      message: err.errorDelete.message,
      error: error.message,
    });
  }
}

async function getAllUsers(req, res) {
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
      userObj.username = user.username;
      userObj.email = user.email;
      userObj.fullname = user.fullname;
      userObj.role = user.role_id;
      userObj.role = user.role;
      userList.push(userObj);
    }
    return res.status(200).json({
      data: userList,
    });
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: err.errorSelect.message,
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

async function changeUserRoles(req, res) {
  const { id: userId } = req.params;
  const { roleId: newRoleId } = req.body;
  try {
    const user = await Users.getUserById(userId);
    if (user === undefined) {
      throw new Error("No users found");
    }
    await Users.changeUserRole(userId, newRoleId);
    return res.status(200).json({
      message: "User role updated successfully",
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
  createUsers,
  updateUsers,
  deleteUsers,
  getAllUsers,
  verifyUser,
  forgetPassword,
  changeUserRoles,
  logoutUsers,
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
