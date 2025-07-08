const Teams = require("../models/teams");
const Mentors = require("../models/mentors");
const Mentees = require("../models/mentees");
const permissionTeams = require("./permission_teams");
const permissionMentors = require("./permission_mentors");
const { generateJWT, verifyJWT, generateJWTMentee } = require("../utils/jwt");
const { validatePermission } = require("../middlewares/passport");
const { verifyPassword, hashPassword } = require("../utils/bcrypt");
const { err } = require("../utils/custom_error");

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const verifiedUser = await verifyUser(email, password);
    if (verifiedUser === undefined) {
      return res.status(400).json({ message: "Incorrect email or password!" });
    }
    let getAccess = await permissionTeams.getEffectivePermissionsDFS(verifiedUser.data.roleId);
    if (getAccess === undefined || getAccess.length === 0) {
      getAccess = await permissionMentors.getPermissionMentor(
        verifiedUser.data
      );
    }
    if (getAccess === undefined || getAccess.length === 0) {
      return res
        .status(400)
        .json({ message: "No access rights found for user." });
    }

    const token = await generateJWT(
      verifiedUser.data,
      verifiedUser.type,
      getAccess
    );
    const verifyToken = await verifyJWT(token);
    const validateAccess = await validatePermission(verifyToken);

    if (validateAccess !== "Access granted") {
      return res.status(403).json({
        message: "Access denied: No access rights are available for this user.",
      });
    }
    return res.status(200).json({
      message: "Login successful",
      data: {
        token,
        user: {
          name: verifiedUser.data.fullname,
        },
      },
    });
  } catch (error) {
    return res.status(err.errorLogin.statusCode).json({
      message: error.message,
      error: err.errorLogin.message,
    });
  }
}
async function loginMentee(req, res) {
  try {
    const { email, password } = req.body;

    const verifiedUser = await verifyUser(email, password);
    if (verifiedUser === undefined) {
      return res.status(400).json({ message: "Incorrect email or password!" });
    }

    const token = await generateJWTMentee(verifiedUser.data, verifiedUser.type);
    await verifyJWT(token);
    return res.status(200).json({
      message: "Login successful",
      data: {
        token,
        user: {
          name: verifiedUser.data.fullname,
          type: verifiedUser.type,
        },
      },
    });
  } catch (error) {
    return res.status(err.errorLogin.statusCode).json({
      message: error.message,
      error: err.errorLogin.message,
    });
  }
}
async function verifyUser(email, password) {
  try {
    let type = "team";
    let isUserExists = await Teams.getTeamByEmail(email);
    if (isUserExists === undefined) {
      type = "mentor";
      isUserExists = await Mentors.getMentorByEmail(email);
      if (isUserExists === undefined) {
        type = "mentee";
        isUserExists = await Mentees.getMenteeByEmail(email);
        if (isUserExists === undefined) {
          throw new Error("no user with registered email");
        }
      }
    }
    const isValid = await verifyPassword(password, isUserExists.password);
    return isValid ? { data: isUserExists, type } : undefined;
  } catch (error) {
    throw error;
  }
}

async function forgetPassword(req, res) {
  try {
    const { id: userId } = req.params;
    const { newPassword } = req.body;

    const hashedPassword = await hashPassword(newPassword);
    await Users.forgetUserPassword(hashedPassword, userId);

    return res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    return res.status(err.errorUpdate.statusCode).json({
      message: error.message,
      error: err.errorUpdate.message,
    });
  }
}

async function logout(req, res) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (token === undefined) {
      return res.status(400).json({ message: "No token provided" });
    }
    
    const result = await Users.logoutUser(token);
    if (result) {
      return res.status(200).json({
        message: "Logout successfully",
      });
    }
    return res.status(400).json({ message: "Logout failed" });
  } catch (error) {
    return res.status(err.errorLogout.statusCode).json({
      message: error.message,
      error: err.errorUpdate.message,
    });
  }
}

module.exports = {
  login,
  loginMentee,
  forgetPassword,
  logout,
};
