const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const fs = require("fs");
const config = require("../config/config");
const privateKey = fs.readFileSync(
  "D:/Data Magang Infinite/lms-backend/lms_superadmin_be/keys/private.pem",
  "utf8"
);
const publicKey = fs.readFileSync(
  "D:/Data Magang Infinite/lms-backend/lms_superadmin_be/keys/public.pem",
  "utf8"
);

dotenv.config();

async function generateJWT(user, type, permission) {
  const payload = {
    u: user.id,
    fullname: user.fullname,
    username: user.username,
    roleId: user.role_id,
    type,
    permission: permission,
  };

  var signOptions = {
    issuer: config.issuer,
    subject: user.email,
    audience: config.audience,
    expiresIn: "1day",
    algorithm: "RS256",
  };

  const token = await jwt.sign(payload, privateKey, signOptions);
  return token;
}

async function verifyJWT(token) {
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

async function generateTokenPassword(user) {
  const payload = {
    user: user.email,
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
  generateTokenPassword,
};
