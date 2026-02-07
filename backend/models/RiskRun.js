const mongoose = require("mongoose");

const RiskRunSchema = new mongoose.Schema(
  {
    datasetId: { type: mongoose.Schema.Types.ObjectId, ref: "RiskDataset" },
    portfolio: { type: [Object], default: [] },
    scenarios: { type: [String], default: [] },
    metrics: { type: Object, default: null },
    exposures: { type: [Object], default: [] },
    stressTests: { type: [Object], default: [] },
    recommendations: { type: [String], default: [] },
    status: { type: String, enum: ["success", "error"], required: true },
    error: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RiskRun", RiskRunSchema);
