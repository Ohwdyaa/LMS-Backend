const jwt = require("jsonwebtoken");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const passport = require("passport");
const Users = require("../models/users");
const dotenv = require("dotenv");
dotenv.config();

function generateJWT(user) {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.roleId,
    username: user.username,
  };
  const secret = process.env.JWT_SECRET;
  const options = { expiresIn: "1h" };

  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.sign(payload, secret, options);
}

function verifyJWT(token) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error("Invalid token");
  }
}

function generateRefreshToken(user) {
  const payload = { id: user.id };
  const secret = process.env.REFRESH_TOKEN_SECRET;
  const options = { expiresIn: "1d" };

  if (!secret) {
    throw new Error(
      "REFRESH_TOKEN_SECRET is not defined in environment variables"
    );
  }

  return jwt.sign(payload, secret, options);
}

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(options, async (jwt_payload, done) => {
    try {
      const user = await Users.getUserById(jwt_payload.id);
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {  
      return done(error, false);
    }
  })
);

module.exports = {
  generateJWT,
  verifyJWT,
  generateRefreshToken,
};
