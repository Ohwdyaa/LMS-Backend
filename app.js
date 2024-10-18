const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { passport } = require("./middlewares/auth");
const userRoutes = require("./routes/users");
const roleRoutes = require("./routes/roles");
const religionRoutes = require("./routes/religions");
const genderRoutes = require("./routes/genders");

const categories = require("./routes/categories");

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

app.use(morgan("tiny"));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use("/", userRoutes);
app.use("/", roleRoutes);
app.use("/", religionRoutes);
app.use("/", genderRoutes);

app.use("/", categories);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
