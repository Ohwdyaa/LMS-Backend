const {
  loginUser,
  createUser,
  updateUser,
  deleteUser,
  getAllUser,
  changeUserRole,
  logoutUser,
  forgetPassword,
} = require("../validate/users");
const { err } = require("../utils/customError");
const { use } = require("passport");

async function loginHandler(req, res) {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    if (!result) {
      return res.status(403).json({
        message: "Access denied: No modules available for this user",
      });
    }
    const { token, user } = result;
    // res.cookie("refreshToken", refreshToken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "None",
    //   maxAge: 24 * 60 * 60 * 1000,
    // });
    return res.status(200).json({
      message: "Login successful",
      data: { token, user },
    });
  } catch (error) {
    return res.status(error.statusCode || err.errorLogin.statusCode).json({
      message: error.message || err.errorLogin.message,
      details: error.stack || null,
    });
  }
}

async function createUserHandler(req, res) {
  try {
    const userData = req.body;
    const userId = await createUser(userData);
    return res.status(201).json({
      message: "User created successfully",
      data: { userId },
    });
  } catch (error) {
    return res.status(error.statusCode || err.errorCreate.statusCode).json({
      message: error.message || err.errorCreate.message,
      details: error.details || null,
    });
  }
}

async function updateUserHandler(req, res) {
  try {
    const userEmail = req.user.email;
    const userUpdate = req.body;
    const result = await updateUser(userEmail, userUpdate);
    return res.status(200).json({
      message: "User updated successfully",
      result,
    });
  } catch (error) {
    return res.status(error.statusCode || err.errorUpdate.statusCode).json({
      message: error.message || err.errorUpdate.message,
      details: error.details || null,
    });
  }
}

async function deleteUserHandler(req, res) {
  try {
    const userId = req.params.id;
    await deleteUser(userId);
    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || err.errorDelete.statusCode).json({
      message: error.message || err.errorDelete.message,
      details: error.details || null,
    });
  }
}

async function getAllUserHandler(req, res) {
  try {
    const userAll = await getAllUser();
    return res.status(200).json({
      data: userAll,
    });
  } catch (error) {
    return res.status(error.statusCode || err.errorSelect.statusCode).json({
      message: error.message || err.errorSelect.message,
      details: error.details || null,
    });
  }
}

async function forgetPasswordHandler(req, res) {
  try {
    const { id: userId } = req.params;
    const newPassword = req.body;
    const result = await forgetPassword(newPassword, userId);
    return res.status(200).json({
      message: "Password updated successfully",
      result,
    });
  } catch (error) {
    return res
      .status(error.statusCode || err.errorChangePassword.statusCode)
      .json({
        message: error.message || err.errorChangePassword.message,
        details: error.details || null,
      });
  }
}

async function changeUserRoleHandler(req, res) {
  try {
    const { id: userId } = req.params;
    const { roleId } = req.body;
    const result = await changeUserRole(userId, roleId);
    return res.status(200).json({
      result,
      message: "User role updated successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || err.errorChangeRole.statusCode).json({
      message: error.message || err.errorChangeRole.message,
      details: error.details || null,
    });
  }
}
async function logoutUserHandler(req, res) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(400).json({ message: "No token provided" });
    }
    const result = await logoutUser(token);
    if (result) {
      return res.status(200).json({
        message: "logout successfully",
      });
    }
  } catch (error) {
    return res.status(error.statusCode || err.errorLogout.statusCode).json({
      message: error.message || err.errorLogout.message,
      details: error.details || null,
    });
  }
}

module.exports = {
  loginHandler,
  createUserHandler,
  updateUserHandler,
  deleteUserHandler,
  getAllUserHandler,
  forgetPasswordHandler,
  changeUserRoleHandler,
  logoutUserHandler,
};
// async function refreshTokenHandler(req, res) {
//   try {
//     const refreshToken = req.cookies.refreshToken;

//     if (!refreshToken)
//       return res.status(401).send({ message: "Akses Tidak Sah" });

//     const token = await getAccessToken(refreshToken);

//     return res.status(200).send(token);
//   } catch (error) {
//     return res.status(400).send(error.message);
//   }
// }
