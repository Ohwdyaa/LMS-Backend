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
module.exports = {
  passport,
  validatePermission
};