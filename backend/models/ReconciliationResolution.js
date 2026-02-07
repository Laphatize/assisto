const mongoose = require("mongoose");

const HistorySchema = new mongoose.Schema(
  {
    status: { type: String, enum: ["matched", "exception", "pending", "resolved"], required: true },
    matched_with: { type: String, default: null },
    notes: { type: String, default: "" },
    at: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ReconciliationResolutionSchema = new mongoose.Schema(
  {
    transactionId: { type: String, required: true, index: true },
    status: { type: String, enum: ["matched", "exception", "pending", "resolved"], required: true },
    matched_with: { type: String, default: null },
    notes: { type: String, default: "" },
    history: { type: [HistorySchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ReconciliationResolution", ReconciliationResolutionSchema);
