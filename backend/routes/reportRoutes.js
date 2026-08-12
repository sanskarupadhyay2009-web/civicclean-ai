const express = require("express");
const upload = require("../middleware/upload");
const protect = require("../middleware/authMiddleware");

const {
  analyzeReport,
  getReports,
  getMyReports,
  deleteReport,
} = require("../controllers/reportController");

const router = express.Router();

router.post("/analyze", protect, upload.single("image"), analyzeReport);

// New route
router.get("/", protect, getReports);

router.get("/mine", protect, getMyReports);
router.delete("/:id", protect, deleteReport);

module.exports = router;
