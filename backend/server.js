const path = require("path");
const fs = require("fs");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");

// Load environment
dotenv.config();

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, process.env.UPLOADS_PATH || "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// DB connection (created in config/db.js)
const connectDB = require("./config/db");

// Route modules (implemented in /routes)
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orders");
const userRoutes = require("./routes/users");

// Error handler middleware (implemented in /middleware)
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

// Connect to MongoDB. If connection fails, log a warning and continue in fallback (in-memory) mode.
connectDB().then(() => {
  // successful connection is logged inside connectDB
}).catch((err) => {
  console.warn("Failed to connect to MongoDB — running in fallback mode (in-memory).", err && err.message ? err.message : err);
  // Do not exit; allow the server to run without a DB for development/testing purposes.
});

// Middleware
app.use(helmet());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET || ""));

// CORS
// In development allow the requesting origin so the frontend can run on different ports (5173/5174)
// In production you should set a specific CLIENT_URL and validate origins.
// CORS - allow localhost dev origins and configured client URL(s)
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
const allowedClientUrls = clientUrl.split(",").map((s) => s.trim());
app.use(
  cors({
    origin: (origin, cb) => {
      // allow non-browser tools or same-origin requests with no origin
      if (!origin) return cb(null, true);
      // allow configured client URLs
      if (allowedClientUrls.includes(origin)) return cb(null, true);
      // allow any localhost origin in development (different ports like 5173/5174)
      if (process.env.NODE_ENV !== "production" && origin.startsWith("http://localhost"))
        return cb(null, true);
      return cb(new Error("Not allowed by CORS"), false);
    },
    credentials: true,
  }),
);

// Logging
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Rate limiter
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10),
  max: parseInt(process.env.RATE_LIMIT_MAX || "100", 10),
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Serve uploads
app.use("/uploads", express.static(uploadsDir));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Backend server is running" });
});

// 404 handler and central error handler
app.use(notFound);
app.use(errorHandler);

// Start server
const DEFAULT_PORT = parseInt(process.env.PORT || "5000", 10);
let server;

const startServer = (port) => {
  server = app.listen(port, () => {
    console.log(
      `Server running in ${process.env.NODE_ENV || "development"} mode on http://localhost:${port}`,
    );
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE" && port === DEFAULT_PORT) {
      const fallbackPort = port + 1;
      console.warn(`Port ${port} is in use. Trying fallback port ${fallbackPort}...`);
      startServer(fallbackPort);
      return;
    }

    console.error("Server failed to start:", err);
    process.exit(1);
  });
};

startServer(DEFAULT_PORT);

// Graceful shutdown
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

process.on("SIGINT", () => {
  console.log("SIGINT received: closing server");
  server.close(() => process.exit(0));
});

module.exports = app;
