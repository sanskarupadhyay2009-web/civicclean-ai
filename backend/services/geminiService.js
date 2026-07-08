console.log("Gemini key exists:", !!process.env.GEMINI_API_KEY);

const axios = require("axios");
const fs = require("fs");
const path = require("path");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

/* ================================
   SAFE GEMINI CHAT (FIXED)
================================ */

async function chatWithGemini(message) {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `
You are CivicClean AI, an environmental assistant.

Keep answers:
- simple
- helpful
- short
- eco-focused

User: ${message}
                `,
              },
            ],
          },
        ],
      }
    );

    const text =
      response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    return text || "No response from Gemini.";
  } catch (err) {
    console.error("Gemini Error:", err?.response?.data || err.message);

    if (err?.response?.status === 429) {
      throw new Error(
        "We've hit Gemini's free-tier rate limit (too many requests in a short time). Please wait about a minute and try again."
      );
    }

    throw new Error("Gemini API request failed");
  }
}

/* ================================
   IMAGE ANALYSIS (SAFE)
================================ */

function getMimeType(imagePath) {
  const ext = path.extname(imagePath).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  return "image/jpeg";
}

async function analyzeWasteImage(imagePath) {
  try {
    const imageBytes = fs.readFileSync(imagePath, {
      encoding: "base64",
    });

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `
You are an AI waste-detection system for a civic cleanliness app.
Look at the image and identify the waste/litter/garbage shown.

Respond with ONLY raw JSON (no markdown, no code fences, no extra text) in exactly this shape:
{
  "wasteType": "short name of the waste, e.g. Plastic Bottles",
  "category": "one of: Recyclable, Organic, Hazardous, Electronic, Mixed, Other",
  "severity": "one of: Low, Medium, High",
  "confidence": 0,
  "recommendation": "a specific, actionable sentence telling the reporter exactly what to do about this waste (e.g. how to dispose of, recycle, or report it) — this field must never be empty",
  "hazard": false
}

"confidence" must be a number from 0-100. "hazard" must be true only if the waste poses a health/safety risk.
"recommendation" is required and must always contain real, specific advice — never leave it blank or generic filler.
If the image does not show waste/litter, still return valid JSON with your best-guess fields, a low confidence, and a recommendation relevant to what IS in the image.
                `,
              },
              {
                inline_data: {
                  mime_type: getMimeType(imagePath),
                  data: imageBytes,
                },
              },
            ],
          },
        ],
      }
    );

    return response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
  } catch (err) {
    console.error("Image Error:", err?.response?.data || err.message);

    if (err?.response?.status === 429) {
      throw new Error(
        "We've hit Gemini's free-tier rate limit (too many requests in a short time). Please wait about a minute and try again."
      );
    }

    throw new Error("Image analysis failed");
  }
}

/* ================================
   CHAT WITH IMAGE (for Assistant chatbot)
================================ */

async function chatWithGeminiImage(message, imageBuffer, mimeType) {
  try {
    const imageBase64 = imageBuffer.toString("base64");

    const promptText = `
You are CivicClean AI, an environmental assistant. The user has attached an image.

Keep answers:
- simple
- helpful
- conversational
- eco-focused

If the image shows waste, litter, or a pollution-related issue, describe what you see and give
practical advice (e.g. how to dispose of / recycle it, or how to report it).
If the image is unrelated to waste/environment, just answer naturally and helpfully anyway.

User's message: ${message || "(no text, just the image)"}
    `;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              { text: promptText },
              {
                inline_data: {
                  mime_type: mimeType || "image/jpeg",
                  data: imageBase64,
                },
              },
            ],
          },
        ],
      }
    );

    const text =
      response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    return text || "No response from Gemini.";
  } catch (err) {
    console.error("Gemini Image Chat Error:", err?.response?.data || err.message);

    if (err?.response?.status === 429) {
      throw new Error(
        "We've hit Gemini's free-tier rate limit (too many requests in a short time). Please wait about a minute and try again."
      );
    }

    throw new Error("Gemini API request failed");
  }
}

module.exports = {
  chatWithGemini,
  analyzeWasteImage,
  chatWithGeminiImage,
};
