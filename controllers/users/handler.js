const {
  createUser,
  loginUser,
  changeUserRole,
  getAccessToken,
} = require("./service");
const { errors } = require("../../utils/customError");
const Roles = require("../../models/roles");
const Genders = require("../../models/genders");
const Religions = require("../../models/religions");
const { validateEmail } = require("../../middlewares/validate");

async function createUserHandler(req, res) {
  try {
    const userData = req.body;

    if (!validateEmail(userData.email)) {
      return res.status(errors.invalidEmail.statusCode).json({
        status: "error",
        message: errors.invalidEmail.message,
      });
    }

    const validRole = await Roles.getRoleById(userData.roleId);
    if (!validRole) {
      return res.status(errors.roleInvalid.statusCode).json({
        status: "error",
        message: errors.roleInvalid.message,
      });
    }

    // const validGender = await Genders.getGenderById(userData.genderId);
    // if (!validGender) {
    //   return res.status(errors.genderInvalid.statusCode).json({
    //     status: "error",
    //     message: errors.genderInvalid.message,
    //   });
    // }

    // const validReligion = await Religions.getReligionById(userData.religionId);
    // if (!validReligion) {
    //   return res.status(errors.religionInvalid.statusCode).json({
    //     status: "error",
    //     message: errors.religionInvalid.message,
    //   });
    // }

    const userId = await createUser(userData);
    return res.status(201).json({
      status: "success",
      message: "User created successfully",
      data: { userId },
    });
  } catch (error) {
    console.error("Error in createUserHandler:", error);
    return res.status(errors.internalServerError.statusCode).json({
      status: "error",
      message: errors.internalServerError.message,
    });
  }
}

async function loginHandler(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(errors.requiredEmailPassword.statusCode).json({
      status: "error",
      message: errors.requiredEmailPassword.message,
    });
  }

  try {
    console.log("Attempting to login user:", email);
    const { token, refreshToken, user } = await loginUser(email, password);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      status: "success",
      message: "Login successful",
      data: { token, user },
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    return res
      .status(error.statusCode || errors.internalServerError.statusCode)
      .json({
        status: "error",
        message: error.message || errors.internalServerError.message,
        details: error.details || null,
      });
  }
}

async function changeUserRoleHandler(req, res) {
  const userId = req.params.id;
  const { roleId } = req.body;
  try {
    const result = await changeUserRole(userId, roleId);

    return res.status(200).json({
      status: "success",
      message: result.message,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message || "Failed to change role",
    });
  }
}

async function refreshTokenHandler(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken)
      return res.status(401).send({ message: "Akses Tidak Sah" });

    const token = await getAccessToken(refreshToken);

    res.status(200).send(token);
  } catch (error) {
    res.status(400).send(error.message);
  }
}

module.exports = {
  createUserHandler,
  loginHandler,
  changeUserRoleHandler,
  refreshTokenHandler
};
