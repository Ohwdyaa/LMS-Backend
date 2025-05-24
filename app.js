const express = require("express");
const app = express();
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const { passport } = require("./middlewares/passport");
const routes = require("./routes");
const compression = require("compression");

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [];
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

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, 
	limit: 100,
	standardHeaders: 'draft-7', 
	legacyHeaders: false, 
});

app.use(compression());
app.use(cors(corsOptions));
app.use(express.json());
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
// app.use(limiter);
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

app.use(passport.initialize());
app.use(routes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
