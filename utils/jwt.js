const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const config = require("../config/config");
const fs = require("fs");
const privateKey = fs.readFileSync("D:/DATA KELAS/magang infinte/lms-backend/keys/private.pem", "utf8");
const publicKey = fs.readFileSync("D:/DATA KELAS/magang infinte/lms-backend/keys/public.pem", "utf8");
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
    expiresIn: "1d",
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
  generateResetToken,
};