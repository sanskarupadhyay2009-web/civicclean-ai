const { chatWithGemini } = require("../services/geminiService");

const chat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const reply = await chatWithGemini(message);

    res.json({
      success: true,
      reply,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "AI failed to respond",
    });
  }
};

module.exports = {
  chat,
};
