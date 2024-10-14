const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { passport } = require("./middlewares/auth");
const db = require("./config/db/db");
const userRoutes = require("./routes/users");
const forgetPasswordRoutes = require("./routes/forgot_password")
const roleRoutes = require("./routes/roles");
const religionRoutes = require("./routes/religions");
const genderRoutes = require("./routes/genders");
const modulePermission = require("./routes/module_permission");
const moduleCategory = require("./routes/module_category");
const permissions = require("./routes/permissions");

//buat cors
const allowedOrigins = ["http://localhost:5173"];
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};


app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use("/", userRoutes);
app.use("/", forgetPasswordRoutes);
app.use("/", roleRoutes);
app.use("/", religionRoutes);
app.use("/", genderRoutes);
app.use("/", modulePermission);
app.use("/", moduleCategory);
app.use("/", permissions);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
