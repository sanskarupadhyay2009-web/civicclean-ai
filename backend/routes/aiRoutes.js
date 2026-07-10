const express = require("express");
const multer = require("multer");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const AIUsage = require("../models/AIUsage");

console.log("✅ aiRoutes.js loaded");

const {
  chatWithGemini,
  chatWithGeminiImage,
} = require("../services/geminiService");

// In-memory storage
const chatImageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];

    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, PNG and WEBP images are allowed."));
    }
  },
});

/* ==========================================================
   TEST ROUTE
========================================================== */

router.get("/test", (req, res) => {
  console.log("✅ GET /api/ai/test");

  res.json({
    success: true,
    message: "AI Routes Working",
  });
});

/* ==========================================================
   CHAT ROUTE
========================================================== */

router.post("/chat", protect, async (req, res) => {
  console.log("✅ POST /api/ai/chat");

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    console.log("========== AI REQUEST ==========");
    console.log("User ID:", req.user._id);
    console.log("Name:", req.user.name);
    console.log("Email:", req.user.email);
    console.log("Message:", message);
    console.log(
      "IP:",
      req.headers["x-forwarded-for"] || req.socket.remoteAddress
    );
    console.log("Time:", new Date().toISOString());
    console.log("================================");

    const reply = await chatWithGemini(message);

    // Save to MongoDB
try {
  const usage = await AIUsage.create({
    user: req.user._id,
    name: req.user.name,
    email: req.user.email,

    type: "chat",

    prompt: message,
    reply,

    ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
    userAgent: req.headers["user-agent"],
  });

  console.log("✅ AI Usage saved successfully");
  console.log("Document ID:", usage._id);
} catch (dbErr) {
  console.error("❌ Failed to save AI Usage");
  console.error(dbErr);
}

    res.json({
      success: true,
      reply,
    });
  } catch (err) {
    console.error("🔥 AI Route Error");
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ==========================================================
   CHAT WITH IMAGE ROUTE
========================================================== */

router.post(
  "/chat-image",
  protect,
  chatImageUpload.single("image"),
  async (req, res) => {
    console.log("✅ POST /api/ai/chat-image");

    try {
      const { message } = req.body;

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Image is required",
        });
      }

      console.log("======= IMAGE ANALYSIS REQUEST =======");
      console.log("User ID:", req.user._id);
      console.log("Name:", req.user.name);
      console.log("Email:", req.user.email);
      console.log("Prompt:", message);
      console.log("Image:", req.file.originalname);
      console.log("Size:", req.file.size, "bytes");
      console.log("Type:", req.file.mimetype);
      console.log(
        "IP:",
        req.headers["x-forwarded-for"] || req.socket.remoteAddress
      );
      console.log("Time:", new Date().toISOString());
      console.log("======================================");

      const reply = await chatWithGeminiImage(
        message,
        req.file.buffer,
        req.file.mimetype
      );

      // Save to MongoDB
try {
  const usage = await AIUsage.create({
    user: req.user._id,
    name: req.user.name,
    email: req.user.email,

    type: "image",

    prompt: message || "",
    reply,

    imageName: req.file.originalname,
    imageType: req.file.mimetype,
    imageSize: req.file.size,

    ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
    userAgent: req.headers["user-agent"],
  });

  console.log("✅ Image Usage saved successfully");
  console.log("Document ID:", usage._id);
} catch (dbErr) {
  console.error("❌ Failed to save Image Usage");
  console.error(dbErr);
}

      res.json({
        success: true,
        reply,
      });
    } catch (err) {
      console.error("🔥 AI Chat-Image Route Error");
      console.error(err);

      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
);

module.exports = router;
