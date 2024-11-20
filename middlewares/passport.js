const passport = require("passport");
const { Strategy, ExtractJwt } = require("passport-jwt");
const fs = require("fs");
const publicKey = fs.readFileSync(
  "E:/Task/TUGAS-TUGAS/Main/IL/lms/lms-backend/keys/public.pem",
  "utf8"
);
const Teams = require("../models/teams");
const Mentors = require("../models/mentors");

passport.use(
  new Strategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: publicKey,
    },
    async function (jwtPayload, cb) {
      try {
        let isUserExists = await Teams.getTeamById(jwtPayload.u);
        if (isUserExists === undefined) {
          isUserExists = await Mentors.getMentorById(jwtPayload.u);
          if (isUserExists === undefined) {
            return cb(null, false, { message: "User not found" });
          }
        }
        return cb(null, isUserExists);
      } catch (error) {
        return error;
      }
    }
  )
);

async function validatePermission(token) {
  const permission = token.permission;
  let access = false;

  for (let i = 0; i < permission.length; i++) {
    const p = permission[i];
    if (p.create == 1 || p.read == 1 || p.edit == 1 || p.delete == 1) {
      access = true;
      break;
    }
  }
  if (!access) {
    return "Access denied: No modules available for this user";
  }
  return "Access granted";
}

module.exports = {
  passport,
  validatePermission,
};
