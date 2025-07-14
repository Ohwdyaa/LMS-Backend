const express = require("express");
const app = express();
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const { passport } = require("./middlewares/passport");
const routes = require("./routes");
const compression = require("compression");
const responseTime = require('./utils/responseTime'); // Import middleware Anda

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
app.use(responseTime);
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
// Inisialisasi interval untuk mencatat memori secara berkala
setInterval(() => {
  const memUsage = process.memoryUsage();
 
  // 'rss' (Resident Set Size) adalah metrik memori paling relevan
  // karena menunjukkan berapa banyak RAM fisik yang sedang digunakan oleh proses Anda.
  const rssMemoryMB = (memUsage.rss / 1024 / 1024).toFixed(2); // Konversi bytes ke MB

  // 'heapUsed' menunjukkan memori yang digunakan oleh JavaScript objects
  const heapUsedMemoryMB = (memUsage.heapUsed / 1024 / 1024).toFixed(2);

  console.log(`[MEMORY USAGE] RSS: ${rssMemoryMB} MB | Heap Used: ${heapUsedMemoryMB} MB`);

},60000); // Catat setiap 5 detik (Anda bisa sesuaikan interval ini)
 