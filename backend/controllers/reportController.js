const Report = require("../models/Report");
const { analyzeWasteImage } = require("../services/geminiService");

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

    // Gemini occasionally omits or empties this field — always guarantee
    // a usable recommendation so the UI never shows a blank section.
    if (!analysis.recommendation || !analysis.recommendation.trim()) {
      analysis.recommendation =
        "Dispose of this waste at the nearest designated waste/recycling point, and avoid handling it directly if it appears hazardous.";
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
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
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

module.exports = {
  analyzeReport,
};
