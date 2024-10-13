const passport = require("passport");
const { Strategy, ExtractJwt } = require("passport-jwt");
const fs = require("fs");
const publicKey = fs.readFileSync(
  "D:/DATA KELAS/magang infinte/lms-backend/keys/public.pem",
  "utf8"
);

passport.use(
  new Strategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: publicKey,
    },
    async function (jwtPayload, cb) {
      try {
        const user = {
          email: jwtPayload.email,
          fullname: jwtPayload.fullname,
          roleId: jwtPayload.roleId,
          permission: jwtPayload.permission,  
        };

        if (user === undefined) {
          return cb(null, false, { message: "User not found" });
        }
        return cb(null, user);
      } catch (error) {
        return error;
      }
    }
  )
);  

const checkPermission = (permission) => {
  return (req, res, next) => {
    console.log("User data in req.user:", req.user);
    const userPermission = req.user.permission || {};

    if (userPermission[permission] !== 1) {
      return res.status(403).json({ message: "Permission denied", permission });
    }
    
    next();
  };
};

module.exports = {
  passport,
  checkPermission
};