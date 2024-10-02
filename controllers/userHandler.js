const {
  createUser,
  loginUser,
  changeUserRole,
  // getAccessToken,
  updateUser,
  deleteUser,
  getAllUser,
  logoutUser,
} = require("../service/userService");
const { errors, err } = require("../utils/customError");
const Roles = require("../models/roles");
const Genders = require("../models/genders");
const Religions = require("../models/religions");
const { validateEmail } = require("../middlewares/validate");

async function loginHandler(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(errors.requiredEmailPassword.statusCode).json({
      message: errors.requiredEmailPassword.message,
    });
  }
  try {
    const { token, user } = await loginUser(email, password);

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
    console.error("Login error:", error);
    return res
      .status(error.statusCode || errors.internalServerError.statusCode)
      .json({
        message: error.message || errors.internalServerError.message,
        details: error.details || null,
      });
  }
}

async function createUserHandler(req, res) {
  try {
    const userData = req.body;

    if (!validateEmail(userData.email)) {
      return res.status(errors.invalidEmail.statusCode).json({
        message: errors.invalidEmail.message,
      });
    }

    const validRole = await Roles.getRoleById(userData.roleId);
    if (!validRole) {
      return res.status(errors.roleInvalid.statusCode).json({
        message: errors.roleInvalid.message,
      });
    }

    const validGender = await Genders.getGenderById(userData.genderId);
    if (!validGender) {
      return res.status(errors.genderInvalid.statusCode).json({
        message: errors.genderInvalid.message,
      });
    }

    const validReligion = await Religions.getReligionById(userData.religionId);
    if (!validReligion) {
      return res.status(errors.religionInvalid.statusCode).json({
        message: errors.religionInvalid.message,
      });
    }

    const userId = await createUser(userData);
    return res.status(201).json({
      message: "User created successfully",
      data: { userId },
    });
  } catch (error) {
    return res.status(errors.internalServerError.statusCode).json({
      message: errors.internalServerError.message,
    });
  }
}

async function updateUserHandler(req, res) {
  const { id: userId } = req.params;
  const userUpdate = req.body;
  try {
    const result = await updateUser(userId, userUpdate);
    return res.status(200).json({
      message: "User updated successfully",
      result,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
}

async function deleteUserHandler(req, res) {
  const userId = req.params.id;
  try {
    await deleteUser(userId);
    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function getAllUserHandler(req, res) {
  try {
    const userAll = await getAllUser();
    return res.status(200).json({
      data: userAll,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
}
async function changeUserRoleHandler(req, res) {
  const { id: userId } = req.params;
  const { roleId } = req.body;
  try {
    const result = await changeUserRole(userId, roleId);

    return res.status(200).json({
      message: result.message,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Failed to change role",
    });
  }
}
async function logoutUserHandler(req, res) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    console.log("Token received:", token);

    if (!token) {
      return res.status(400).json({ message: "No token provided" });
    }
    const result = await logoutUser(token);
    if (result) {
      return res.status(400).json({
        message: "logout successfully",
      });
    }
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error during logout:", error);
    return res.status(400).json({
      message: err.cannotLogout,
      error: error.message,
    });
  }
}

module.exports = {
  createUserHandler,
  updateUserHandler,
  deleteUserHandler,
  getAllUserHandler,
  loginHandler,
  changeUserRoleHandler,
  // refreshTokenHandler,
  logoutUserHandler,
};

// const loginHandler = (req, res, next) => { //loginAuthPassport
//   passport.authenticate('local', { session: false }, (err, user, info) => {
//     if (err || !user) {
//       return res.status(400).json({
//         message: 'Something is not right',
//         user: user
//       });
//     }
//     req.login(user, { session: false }, (err) => {
//       if (err) {
//         return res.send(err);
//       }
//       const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET);
//       return res.json({ user, token });
//     });
//   })(req, res, next);
// };

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
// async function logoutHandler (req, res)  {
//   try {
//     const refreshToken = req.cookies.refreshToken;

//     await logoutUser(refreshToken);

//     res.clearCookie("refreshToken");

//     return res.status(200).json({
//       message: "Logout successful",
//     });
//   } catch (error) {
//     return res.status(400).json({
//       message: error.message,
//     });
//   }
// };
