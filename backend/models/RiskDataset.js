const mongoose = require("mongoose");

const RiskDatasetSchema = new mongoose.Schema(
  {
    portfolio: { type: [Object], default: [] },
    scenarios: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RiskDataset", RiskDatasetSchema);
