const express = require("express");

const upload = require("../middleware/upload");
const protect = require("../middleware/authMiddleware");
const { analyzeReport } = require("../controllers/reportController");

const router = express.Router();

router.post("/analyze", protect, upload.single("image"), analyzeReport);

module.exports = router;
