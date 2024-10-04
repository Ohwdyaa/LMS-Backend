const passport = require("passport");
// const LocalStrategy = require("passport-local").Strategy;
const {Strategy, ExtractJwt} = require("passport-jwt");
const Users = require("../models/users");
const fs = require('fs');
const publicKey = fs.readFileSync('D:/DATA KELAS/magang infinte/lms-backend/keys/public.pem', 'utf8');


passport.use(
  new Strategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: publicKey,
    },
    async function (jwtPayload, cb) {
      try {
        const user = await Users.getUserById(jwtPayload.id);
        if(!user){
          return cb(null, false, { message: 'User not found' });
        }
        return cb(null, user);
      } catch (error) {
        return error;
      }
    }
  )
);

const authorizeRole = (requiredRoleId) => {
  return (req, res, next) => {
    console.log("User from request:", req.user);
    const user = req.user; 
    console.log("User data:", user);

    if (user.role_id !== requiredRoleId) {
      console.log("User data:", user);
      return res.status(403).json({
        message: "Forbidden: You don't have permission to perform this action",
      });
    }
    next();
  };
};

module.exports = {
  passport,
  authorizeRole
};

// passport.use(
//   new LocalStrategy(
//     {
//       usernameField: "email",
//       passwordField: "password",
//     },
//     async function (email, password, cb) {
//       try {
//         const user = await Users.getUserByEmail(email);
//         if (!user) {
//           return cb(null, false, { message: "Incorrect email or password." });
//         }
//         const isMatch = await bcrypt.verifyPassword(password, user.password);
//         if (!isMatch) {
//           return cb(null, false, { message: "Incorrect email or password." });
//         }
//         return cb(null, user, { message: "Logged In Successfully" });
//       } catch (error) {
//         return cb(err);
//       }
//     }
//   )
// );

// const authorizeRole = (requiredRole) => { //validasi role
//   return (req, res, next) => {
//     const user = req.user; // User sudah diverifikasi oleh Passport JWT

//     if (user.role !== requiredRole) {
//       return res.status(403).json({
//         message: "Forbidden: You don't have permission to perform this action",
//       });
//     }

//     next();
//   };
// };

// passport.use(
//   new JwtStrategy(
//     {
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       secretOrKey: process.env.JWT_SECRET,
//     },
//     async (payload, done) => {
//       try {
//         const user = await Users.getUserById(payload.id);
//         if (user.length === 0) {
//           return done(null, false);
//         }
//         return done(null, user);
//       } catch (error) {
//         return done(error, false);
//       }
//     }
//   )
// );

// const authenticate = (req, res, next) => {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];

//   if (!token) return res.sendStatus(401);

//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) return res.sendStatus(403);
//     req.user = user;
//     next();
//   });
// };

// const checkRoles = (roles) => {
//     return async (req, res, next) => {
//         const user = req.user;

//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         if (roles.includes(user.role)) {
//             next();
//         }
//         return res.status(403).json({ message: 'Access forbidden: Role not allowed' });
//     };
// };
