const passport = require("passport");
const { Strategy, ExtractJwt } = require("passport-jwt");
const fs = require("fs");
const publicKey = fs.readFileSync("D:/DATA KELAS/magang infinte/lms-backend/keys/public.pem", "utf8");

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

function validatePermission(token){
  const permission = token.permission;
  let access = false;

  for(let i = 0; i < permission.length; i++){
    const p = permission[i];
    if(p.create == 1 || p.read == 1 || p.edit == 1 || p.delete ==1){
      access = true;
      break;
    }
  }
  if(!access){
    return "Access denied: No modules available for this user";
  }
  return "Access granted";
}
// const checkPermission = (moduleName, permission) => {
//   return (req, res, next) => {
//     console.log("User data in req.user:", req.user);
//     const userPermission = req.user.permission;
//     for (const i = 0; i < userPermission; i++) {
//       if (
//         userPermission[permission] !== 1 &&
//         permission.module_name !== moduleName
//       ) {
//         return res
//           .status(403)
//           .json({ message: "Permission denied", permission });
//       }
//     }
//     next();
//   };
// };

module.exports = {
  passport,
  validatePermission
};
