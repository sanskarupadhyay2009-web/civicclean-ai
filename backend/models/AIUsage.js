const mongoose = require("mongoose");

const aiUsageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: String,
    email: String,

    type: {
      type: String,
      enum: ["chat", "image"],
      required: true,
    },

    prompt: {
      type: String,
      required: true,
    },

    reply: {
      type: String,
    },

    imageName: String,
    imageType: String,
    imageSize: Number,

    ip: String,
    userAgent: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AIUsage", aiUsageSchema);
