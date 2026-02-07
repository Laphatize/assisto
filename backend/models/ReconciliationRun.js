const mongoose = require("mongoose");

const ReconciliationRunSchema = new mongoose.Schema(
  {
    datasetId: { type: mongoose.Schema.Types.ObjectId, ref: "ReconciliationDataset" },
    transactions: { type: [Object], default: [] },
    results: { type: [Object], default: [] },
    summary: { type: Object, default: null },
    recommendations: { type: [String], default: [] },
    status: { type: String, enum: ["success", "error"], required: true },
    error: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ReconciliationRun", ReconciliationRunSchema);
