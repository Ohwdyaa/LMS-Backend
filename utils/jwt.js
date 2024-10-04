const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const fs = require('fs');
const config = require('../config/config')
const privateKey = fs.readFileSync('D:/DATA KELAS/magang infinte/lms-backend/keys/private.pem', 'utf8');
const publicKey = fs.readFileSync('D:/DATA KELAS/magang infinte/lms-backend/keys/public.pem', 'utf8');
dotenv.config();

function generateJWT(user) {
  const payload = {
    email: user.email,
    fulname: user.fulname,
    roleId: user.role_id
  };

  var signOpsions = {
    issuer:  config.issuer,
    subject:  user.email,
    audience:  config.audience,
    expiresIn: "1d",
    algorithm:"RS256"
  };

  return jwt.sign(payload, privateKey, signOpsions);
}

function verifyJWT(token) {
  var verifyOptions = {
    issuer:  config.issuer,
    audience:  config.audience,
    expiresIn:  "12h",
    algorithm:  ["RS256"]
   };
  try {
    return jwt.verify(token, publicKey, verifyOptions);
  } catch (error) {
    throw new Error("Invalid token");
  }
}

module.exports = {
  generateJWT,
  verifyJWT,
  // generateRefreshToken,
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


