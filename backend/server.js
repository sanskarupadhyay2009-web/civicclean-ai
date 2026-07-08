console.log("🔥 SERVER IS STARTING...");

const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const reportRoutes = require("./routes/reportRoutes");
const aiRoutes = require("./routes/aiRoutes");

dotenv.config();
connectDB();

const app = express();

/* ==========================================================
   CORS (SAFE FOR NETLIFY + MOBILE + RENDER)
========================================================== */

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ==========================================================
   REQUEST LOGGER (so we can see EVERY request that hits us)
========================================================== */

app.use((req, res, next) => {
  console.log(`➡️  ${req.method} ${req.originalUrl} | content-type: ${req.headers["content-type"]}`);
  next();
});

/* ==========================================================
   BODY PARSER
========================================================== */

app.use(express.json({ limit: "10mb" }));

/* ==========================================================
   STATIC FILES
========================================================== */

app.use("/uploads", express.static(path.resolve("uploads")));

/* ==========================================================
   ROUTES
========================================================== */

app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/ai", aiRoutes);

/* ==========================================================
   ROOT TEST (Render check)
========================================================== */

app.get("/", (req, res) => {
  res.json({
    success: true,
    project: "CivicClean AI",
    status: "Backend Running 🚀",
  });
});

/* ==========================================================
   AI TEST ROUTE (THIS FIXES YOUR ERROR)
========================================================== */

app.get("/api/ai/test", (req, res) => {
  res.json({
    success: true,
    message: "AI route is working",
  });
});

/* ==========================================================
   404 HANDLER (now logs so nothing fails silently)
========================================================== */

app.use((req, res) => {
  console.warn(`⚠️  404 - No route matched: ${req.method} ${req.originalUrl}`);

  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/* ==========================================================
   ERROR HANDLER
========================================================== */

app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err);

  res.status(500).json({
    success: false,
    message: "Server Error",
    error: err.message,
  });
});

/* ==========================================================
   START SERVER
========================================================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
