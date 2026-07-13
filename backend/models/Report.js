const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    imageUrl: {
      type: String,
      required: true,
    },

    wasteType: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: [
        "Recyclable",
        "Organic",
        "Hazardous",
        "Electronic",
        "Mixed",
        "Other",
      ],
      default: "Other",
    },

    severity: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low",
    },

    confidence: {
      type: Number,
      default: 0,
    },

    recommendation: {
      type: String,
    },

    hazard: {
      type: Boolean,
      default: false,
    },

    description: {
      type: String,
      default: "",
    },

    location: {
      latitude: {
        type: Number,
        required: true,
      },

      longitude: {
        type: Number,
        required: true,
      },

      address: {
        type: String,
        default: "",
      },

      city: {
        type: String,
        default: "",
      },

      state: {
        type: String,
        default: "",
      },

      country: {
        type: String,
        default: "",
      },
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Verified",
        "In Progress",
        "Resolved",
        "Rejected",
      ],
      default: "Pending",
    },

    beforeImage: {
      type: String,
      default: "",
    },

    afterImage: {
      type: String,
      default: "",
    },

    upvotes: {
      type: Number,
      default: 0,
    },

    resolvedAt: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Report", reportSchema);
