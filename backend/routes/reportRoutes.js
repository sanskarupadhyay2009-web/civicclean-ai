const express = require("express");
const upload = require("../middleware/upload");
const protect = require("../middleware/authMiddleware");

const {
  analyzeReport,
  getReports,
} = require("../controllers/reportController");

const router = express.Router();

router.post("/analyze", protect, upload.single("image"), analyzeReport);

// New route
router.get("/", protect, getReports);

module.exports = router;
