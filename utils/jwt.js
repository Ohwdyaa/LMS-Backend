const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const fs = require("fs");
const config = require("../config/config");
const privateKey = fs.readFileSync(
  "E:/Task/TUGAS-TUGAS/Main/IL/lms/lms-backend/keys/private.pem",
  "utf8"
);
const publicKey = fs.readFileSync(
  "E:/Task/TUGAS-TUGAS/Main/IL/lms/lms-backend/keys/public.pem",
  "utf8"
);

dotenv.config();

function generateJWT(user, permission) {
  const payload = {
    username: user.username,
    email: user.email,
    fullname: user.fullname,
    roleId: user.role_id,
    permission: permission,
  };

  var signOptions = {
    issuer: config.issuer,
    subject: user.email,
    audience: config.audience,
    expiresIn: "1day",
    algorithm: "RS256",
  };

  const token = jwt.sign(payload, privateKey, signOptions);
  return token;
}

function verifyJWT(token) {
  var verifyOptions = {
    issuer: config.issuer,
    audience: config.audience,
    expiresIn: "1d",
    algorithm: ["RS256"],
  };
  try {
    return jwt.verify(token, publicKey, verifyOptions);
  } catch (error) {
    throw new Error("Invalid token");
  }
}

function generateResetToken(user) {
  console.log("email:", user.email);

  const payload = {
    user: user.email,
    email : user.email
  };

  const signOptions = {
    issuer: config.issuer,
    subject: user.email,
    audience: config.audience,
    expiresIn: "1h",
    algorithm: "RS256",
  };

  return jwt.sign(payload, privateKey, signOptions);
}

module.exports = {
  generateJWT,
  verifyJWT,
  generateResetToken,
};
// function generateRefreshToken(user) {
//   const payload = { id: user.id };
//   const secret = process.env.REFRESH_TOKEN_SECRET;
//   const options = { expiresIn: "1d" };

//   if (!secret) {
//     throw new Error(
//       "REFRESH_TOKEN_SECRET is not defined in environment variables"
//     );
//   }

//   return jwt.sign(payload, secret, options);
// }
