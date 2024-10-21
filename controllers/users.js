const Users = require("../models/users");
const { generateJWT, verifyJWT } = require("../utils/jwt");
const { validateEmail } = require("../middlewares/validate");
const { verifyPassword, hashPassword } = require("../utils/bcrypt");
const Roles = require("../models/roles");
const Permissions = require("./permissions");
const { validatePermission } = require("../middlewares/auth");
const { err } = require("../utils/customError");

async function loginUser(req, res) {
  const { email, password} = req.body;
  try {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }
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
      return res.status(403).json({ message: "Access denied: No modules available for this user" });
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
    res.status(err.errorLogin.statusCode).json({
      message: err.errorLogin.message,
      error: error.message
    });
  }
}

async function createUser(req, res) {
  const data = req.body;
  try {
    if (!validateEmail(data.email)) {
      throw new Error("Invalid email format");
    }
    const validRole = await Roles.getRoleById(data.roleId);
    if (validRole === undefined) {
      throw new Error("The given role was not found");
    }
    const password = "admin12345";
    const hash = await hashPassword(password);
    const userData = {
      ...data,
      password: hash,
    };
    const userId = await Users.createUser(userData);

    return res.status(201).json({
      message: "User created successfully",
      data: { userId },
    });
  } catch (error) {
    res.status(err.errorCreate.statusCode).json({
      message: err.errorCreate.message,
      error: error.message
    });
  }
}

async function updateUser(req, res) {
  const userEmail = req.user.email; // user jwt
  const userUpdate = req.body; 
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
    res.status(err.errorUpdate.statusCode).json({
      message: err.errorUpdate.message,
      error: error.message
    });
  }
}

async function deleteUser(req, res) {
  const userId = req.params.id;
  try {
    const user = await Users.getUserById(userId);
    if (user === undefined) {
      throw new Error("User not found");
    }
    await Users.deleteUser(userId);
    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(err.errorDelete.statusCode).json({
      message: err.errorDelete.message,
      error: error.message
    });
  }
}

async function getAllUser(req, res) {
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
      userObj.role = user.role;
      userObj.gender = user.gender;
      userList.push(userObj);
    }
    return res.status(200).json({
      data: userList,
    });
  } catch (error) {
    res.status(err.errorSelect.statusCode).json({
      message: err.errorSelect.message,
      error: error.message
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
  const {id: userId} = req.params;
  const {newPassword} = req.body;
  try {
    const hashedPassword = await hashPassword(newPassword);
    await Users.forgetUserPassword(hashedPassword, userId);

    return res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    res.status(err.errorUpdate.statusCode).json({
      message: err.errorUpdate.message,
      error: error.message
    });
  }
}

async function changeUserRole(req, res) {
  const{ id: userId} = req.params;
  const{roleId: newRoleId} = req.body;
  try {
    const user = await Users.getUserById(userId);
    if (!user) {
      throw new Error("No users found");
    }
    await Users.changeUserRole(userId, newRoleId);

    return res.status(200).json({
      message: "User role updated successfully",
    });
  } catch (error) {
    res.status(err.errorUpdate.statusCode).json({
      message: err.errorUpdate.message,
      error: error.message
    });
  }
}
async function logoutUser(req, res) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
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
    res.status(err.errorLogout.statusCode).json({
      message: err.errorLogout.message,
      error: error.message
    });
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
