const Report = require("../models/Report");
const { analyzeWasteImage } = require("../services/geminiService");

// Analyze a new report
const analyzeReport = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No image uploaded.",
      });
    }

    const imagePath = req.file.path;
    const imageUrl = `/uploads/${req.file.filename}`;

    const aiResponse = await analyzeWasteImage(imagePath);

    let analysis;

    try {
      const cleaned = aiResponse
        .trim()
        .replace(/^```json/i, "")
        .replace(/^```/, "")
        .replace(/```$/, "")
        .trim();

      analysis = JSON.parse(cleaned);
    } catch {
      return res.status(500).json({
        message: "Gemini returned invalid JSON.",
        raw: aiResponse,
      });
    }

    if (!analysis.recommendation || !analysis.recommendation.trim()) {
      analysis.recommendation =
        "Dispose of this waste at the nearest designated waste/recycling point, and avoid handling it directly if it appears hazardous.";
    }

    // Validate location
    const latitude = Number(req.body.latitude);
    const longitude = Number(req.body.longitude);

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        message:
          "Location not found. Please allow location permission and try again.",
      });
    }

    const report = await Report.create({
      user: req.user._id,
      imageUrl,
      wasteType: analysis.wasteType,
      category: analysis.category,
      severity: analysis.severity,
      confidence: analysis.confidence,
      recommendation: analysis.recommendation,
      hazard: analysis.hazard,
      description: req.body.description || "",

      location: {
        latitude,
        longitude,
        address: req.body.address || "",
        city: req.body.city || "",
        state: req.body.state || "",
        country: req.body.country || "",
      },
    });

    res.status(201).json({
      success: true,
      report,
      analysis,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message || "Unable to analyze report.",
    });
  }
};

// Get all reports (for LiveMap)
const getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      reports,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message || "Unable to fetch reports.",
    });
  }
};

// Get only the logged-in user's own reports — used for the dashboard's
// real "Reports Submitted" count and a "My Reports" list.
const getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message || "Unable to fetch your reports.",
    });
  }
};

// Delete a report — only its owner or an admin can remove it. This is
// what actually takes a point off the live map/heatmap, since the map
// is generated straight from whatever Report documents still exist.
const deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        message: "Report not found.",
      });
    }

    const isOwner = report.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "You can only delete your own reports.",
      });
    }

    await report.deleteOne();

    res.status(200).json({
      success: true,
      message: "Report deleted.",
      id: req.params.id,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message || "Unable to delete report.",
    });
  }
};

module.exports = {
  analyzeReport,
  getReports,
  getMyReports,
  deleteReport,
};
        
